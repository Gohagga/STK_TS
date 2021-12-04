import { Frame } from "w3ts/handles/frame";

export type DependencyOrientation = 'left' | 'up' | 'right' | 'down';

export interface ITalentView {
    button: {
        main: Frame;
        image: Frame;
    };
    tooltip: {
        box: Frame;
        text: Frame;
        rank: Frame;
    };
    rank: {
        image: Frame;
        text: Frame;
    }
    highlight: Frame;
    links: Record<DependencyOrientation, Frame>;
    linkIntersection: Frame;
}