import { Frame } from "w3ts/handles/frame";

export type DependencyOrientation = 'left' | 'up' | 'right' | 'down';

export interface ITalentView {
    button: {
        main: Frame;
        image: Frame;
    };
    tooltip: {
        box: Frame;
        titleText: Frame;
        descriptionText: Frame;
        rank: Frame;
        titleDescSpace: Frame;
        characteristicFactory: (i: string) => CharacteristicView,
        renderView: (hideCharacteristics: boolean) => void,
    };
    rank: {
        image: Frame;
        text: Frame;
    }
    highlight: Frame;
    links: Record<DependencyOrientation, Frame>;
    linkIntersection: Frame;
    characteristicViews: Record<string, CharacteristicView>;
}

export type CharacteristicView = { image: Frame, text: Frame };