import { Frame } from "w3ts/handles/frame";
import { ITalentTreeView } from "../Interfaces/ITalentTreeView";

export function GenerateBasicTalentTreeView(cfg: IBasicTalentTreeViewConfig, parent: Frame): ITalentTreeView {
    
    const window = Frame.fromHandle(BlzCreateFrame("EscMenuBackdrop", parent.handle, 0, 0));
    const talentTreeContainer = new Frame("ListBoxWar3", window, 0, 0);
    const backgroundArt = Frame.fromHandle(BlzCreateFrameByType("BACKDROP", "TreeBackground", talentTreeContainer.handle, "", 0));
    const titleBackground = Frame.fromHandle(BlzCreateFrameByType("BACKDROP", "TitleBackground", talentTreeContainer.handle, "", 0));
    const titleText = Frame.fromHandle(BlzCreateFrameByType("TEXT", "TitleText", titleBackground.handle, "", 0));
    const confirmButton = new Frame("ScriptDialogButton", window, 0, 0);
    const confirmText = Frame.fromName("ScriptDialogButtonText", 0);
    const cancelButton = new Frame("ScriptDialogButton", window, 0, 0);
    const cancelText = Frame.fromName("ScriptDialogButtonText", 0);
    const closeButton = new Frame("ScriptDialogButton", window, 0, 0);
    const closeText = Frame.fromName("ScriptDialogButtonText", 0);

    window
        .setAbsPoint(FRAMEPOINT_TOPLEFT, cfg.window.x, cfg.window.y) 
        .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, cfg.window.x + cfg.window.width, cfg.window.y - cfg.window.height)
        // .setVisible(false);

    talentTreeContainer
        .clearPoints()
        .setPoint(FramePoint.TL, window, FramePoint.TL, cfg.talentTreeContainer.topLeftOffset[0], cfg.talentTreeContainer.topLeftOffset[1])
        .setPoint(FramePoint.BR, window, FramePoint.BR, cfg.talentTreeContainer.bottomRightOffset[0], cfg.talentTreeContainer.bottomRightOffset[1]);

    backgroundArt
        .setPoint(FramePoint.TL, talentTreeContainer, FramePoint.TL, cfg.talentTreeContainer.backgroundArt.topLeftOffset[0], cfg.talentTreeContainer.backgroundArt.topLeftOffset[1])
        .setPoint(FramePoint.BR, talentTreeContainer, FramePoint.BR, cfg.talentTreeContainer.backgroundArt.bottomRightOffset[0], cfg.talentTreeContainer.backgroundArt.bottomRightOffset[1])
        .setTexture("", 0, true);

    titleBackground
        .setPoint(FramePoint.TL, window, FramePoint.TL, cfg.title.topLeftOffset[0], cfg.title.topLeftOffset[1])
        .setPoint(FramePoint.BR, window, FramePoint.TR, cfg.title.bottomRightOffset[0], cfg.title.bottomRightOffset[1])
        .setTexture(cfg.title.backgroundArt, 0, true);

    titleText
        .setPoint(FramePoint.TL, titleBackground, FramePoint.TL, 0, 0)
        .setPoint(FramePoint.BR, titleBackground, FramePoint.BR, 0, 0)
        .setScale(cfg.title.textScale);
    BlzFrameSetTextAlignment(titleText.handle, TEXT_JUSTIFY_CENTER, TEXT_JUSTIFY_MIDDLE);

    confirmButton
        .clearPoints()
        .setPoint(FramePoint.BR, window, FramePoint.BL, cfg.confirmButton.x, cfg.confirmButton.y)
        .setSize(cfg.confirmButton.width, cfg.confirmButton.height)
        .text = cfg.confirmButton.text;

    cancelButton
        .clearPoints()
        .setPoint(FramePoint.BL, window, FramePoint.BR, cfg.cancelButton.x, cfg.cancelButton.y)
        .setSize(cfg.cancelButton.width, cfg.cancelButton.height)
        .text = cfg.cancelButton.text;

    closeButton
        .clearPoints()
        .setPoint(FramePoint.TR, window, FramePoint.TR, cfg.closeButton.x, cfg.closeButton.y)
        .setSize(cfg.closeButton.width, cfg.closeButton.height)
        .text = cfg.closeButton.text;

    const retVal: ITalentTreeView = {
        window,
        talentTreeContainer,
        backgroundArt,
        titleText,
        confirm: {
            buttonMain: confirmButton,
            text: confirmText
        },
        cancel: {
            buttonMain: cancelButton,
            text: cancelText
        },
        close: {
            buttonMain: closeButton,
            text: closeText
        }
    }
    return retVal;
}

export interface IBasicTalentTreeViewConfig {
    window: {
        x: number,
        y: number,
        width: number,
        height: number,
    },
    title: {
        backgroundArt: string,
        textScale: number,
        topLeftOffset: [number, number],
        bottomRightOffset: [number, number],
    },
    cancelButton: {
        text: string,
        x: number,
        y: number,
        width: number,
        height: number,
    },
    confirmButton: {
        text: string,
        x: number,
        y: number,
        width: number,
        height: number,
    },
    closeButton: {
        text: string,
        x: number,
        y: number,
        width: number,
        height: number,
    },
    talentTreeContainer: {
        topLeftOffset: [number, number],
        bottomRightOffset: [number, number],
        backgroundArt: {
            topLeftOffset: [number, number],
            bottomRightOffset: [number, number],
        },
    },
}
    
const FramePoint = {
    C: FRAMEPOINT_CENTER,
    T: FRAMEPOINT_TOP,
    B: FRAMEPOINT_BOTTOM,
    TL: FRAMEPOINT_TOPLEFT,
    TR: FRAMEPOINT_TOPRIGHT,
    BL: FRAMEPOINT_BOTTOMLEFT,
    BR: FRAMEPOINT_BOTTOMRIGHT,
    L: FRAMEPOINT_LEFT,
    R: FRAMEPOINT_RIGHT,
}