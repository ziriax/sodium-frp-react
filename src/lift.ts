import * as React from 'react';

export type Unlisten = () => void;

export interface Producer<T = any> {
    listen(action: (value: T) => void): Unlisten;
}

export function isProducer<T>(p: any | Producer<T>): p is Producer<T> {
    return typeof p === "object" && typeof p.listen === "function";
}

export type LiftedProps<P> = {readonly [K in keyof P]: P[K] | Producer<P[K]> };

export type Renderable = JSX.Element | null | false;

export interface SamplerProps<T> {
    /** The cell that must be sampled */
    readonly cell: Producer<T>;

    /** If no renderer is provided for the sampled value, we assume the value itself is renderable */
    readonly render?: (value: T) => Renderable;
}

export class Sampler<T> extends React.PureComponent<SamplerProps<T>, { value: Renderable }> {

    unlisten: Unlisten | null = null;

    componentWillMount() {
        this.relisten(this.props);
    }

    componentWillUnmount() {
        this.relisten();
    }

    componentWillReceiveProps(nextProps: Readonly<SamplerProps<T>>) {
        this.relisten(nextProps);
    }

    relisten(props?: Readonly<SamplerProps<T>>) {
        if (this.unlisten) {
            this.unlisten();
            this.unlisten = null;
        }

        if (props) {
            this.unlisten = props.cell.listen(value => this.setState({
                value: this.props.render ? this.props.render(value) : value as any
            }));
        }
    }

    render(): Renderable {
        const { value = null } = this.state;
        return value;
    }
};

/** Samples a single prop cell to a single state value */
export function sample<T>(props: SamplerProps<T>): Sampler<T> {
    return new Sampler<T>(props);
}

export abstract class LiftedComponent<P> extends React.PureComponent<LiftedProps<P>, P> {

    unlisteners: {[key in keyof P]?: Unlisten | null} = {};

    log(msg: string) {
        //console.info(msg, JSON.stringify(this.state));
    }

    componentWillMount() {
        this.log("componentWillMount");
        this.relisten(this.props);
    }

    componentWillUnmount() {
        this.log("componentWillUnmount");
        this.relisten();
    }

    componentWillReceiveProps(nextProps: LiftedProps<P>) {
        this.log("componentWillReceiveProps");
        this.relisten(nextProps);
    }

    relisten(newProps?: LiftedProps<P>) {
        const oldProps: LiftedProps<P> = this.props;

        const unlisteners = this.unlisteners;

        for (let key in unlisteners) {
            const unlisten = unlisteners[key];
            if (unlisten && (!newProps || oldProps[key] !== newProps[key])) {
                unlisten();
                unlisteners[key] = null;
            }
        }

        if (newProps) {
            const state: any = {};

            for (let key in newProps) {
                if (newProps.hasOwnProperty(key)) {
                    const value = newProps[key];

                    if (isProducer(value)) {
                        // Don't listen twice to the same prop cell!
                        if (!unlisteners[key]) {
                            this.log(`Started listening to ${key}`);
                            unlisteners[key] = value.listen(x => this.setState({ [key]: x } as any));
                        } else {
                            this.log(`Already listening to ${key}`);
                        }
                        continue;
                    }

                    // A constant value, just put in the state.
                    this.log(`Constant value for ${key}`);
                    state[key] = value;
                }
            }

            this.setState(state);
        }
    }
};

export interface LiftedComponentClass<P> {
    new(props: LiftedProps<P>, context?: any): LiftedComponent<P>;
}

/** 
 * Higher order component for that lifts a regular React component into a SodiumJS compatible component.
 * The lifted component will accept either the same prop as the original React component, or Sodium Cell of that prop.
 * When the lifted component is mounted, it will listen to all these cells, converting the current value to local state.
 * When the liften component is unmount, it stops listening.
 * @argument ChildClass  The React component class that will be lifted
 */
export function lift<P>(ChildClass: React.ComponentClass<P> | React.StatelessComponent<P>): LiftedComponentClass<P> {
    return class extends LiftedComponent<P> {
        public render() {
            return React.createElement(ChildClass, this.state);
        }
    };
}

function renderUnorderedList(itemElements: JSX.Element[]): Renderable {
    return React.createElement("ul", { className: "list-group" }, itemElements);
}

/** 
 * Higher order component for rendering lists of items
 * @argument ItemClass   The React component class that renders the items
 * @argument getItems    How to get items list from the props 
 * @argument getItemKey  How to get a suitable React key for an item component from the item props 
 * @argument renderList  How to render the list. By default this renders an <ul> with className 'list-group'  
 */
export function list<P, T>(ItemClass: React.ComponentClass<T> | React.StatelessComponent<T>,
    getItems: (props: P) => ReadonlyArray<T>,
    getItemKey: (item: T, index: number) => string,
    renderList?: (items: JSX.Element[]) => Renderable): LiftedComponentClass<P> {
    const listRenderer = renderList || renderUnorderedList;
    return class extends LiftedComponent<P> {
        public render() {
            const items = getItems(this.state);
            return listRenderer(items.map((item: any, index: number) =>
                React.createElement(ItemClass, { ...item, key: getItemKey(item, index) })));
        }
    };
}

/** 
 * Higher order component for switching to a single child based on sampled props
 */
export function switcher<P>(getChild: (props: P) => JSX.Element): LiftedComponentClass<P> {
    return class extends LiftedComponent<P> {
        public render() {
            return getChild(this.state);
        }
    };
}
