import * as React from 'react';
import { Cell, Stream, Operational } from "sodiumjs"

export type Unlisten = () => void;

export type LiftedProps<P> = {[K in keyof P]: P[K] | Cell<P[K]> };

export type Rendered = JSX.Element | JSX.Element[] | React.ReactPortal | string | number | null | false;

export abstract class LiftedComponent<P> extends React.PureComponent<LiftedProps<P>, P> {

    unlisteners: {[key in keyof P]?: Unlisten} = {};

    log(msg: string) {
        //console.info(msg, JSON.stringify(this.state));
    }

    componentWillMount() {
        this.log("componentWillMount");
        this.relisten(this.props);
    }

    componentWillUnmount() {
        this.log("componentWillUnmount");
        this.relisten(null);
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
            const state = {} as Pick<P, keyof P>;

            for (let key in newProps) {
                if (newProps.hasOwnProperty(key)) {
                    const value = newProps[key];

                    if (value instanceof Stream) {
                        // Don't listen to streams, these are passed down for event handling.
                        continue;
                    }

                    if (value instanceof Cell) {
                        // Don't listen twice to the same prop cell!
                        if (!unlisteners[key]) {
                            unlisteners[key] = value.listen(x => this.setState({ [key as any]: x }));
                        }
                        continue;
                    }

                    // A constant value, just put in the state.
                    state[key] = value;
                }
            }

            this.setState(state);
        }
    }
};

export interface LiftedComponentClass<P> {
    new (props?: LiftedProps<P>, context?: any): LiftedComponent<P>;
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
            return React.createElement(ChildClass, this.state, this.props.children);
        }
    };
}

function renderUnorderedList(itemElements: JSX.Element[]): Rendered {
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
    renderList?: (items: JSX.Element[]) => Rendered): LiftedComponentClass<P> {
    const listRenderer = renderList || renderUnorderedList;
    return class extends LiftedComponent<P> {
        public render() {
            const items = getItems(this.state);
            return listRenderer(items.map((item: any, index: number) =>
                React.createElement(ItemClass, { ...item, key: getItemKey(item, index) }, item && item.children)));
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
