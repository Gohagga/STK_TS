import { Initialize } from "Setup";
import { Timer, Unit } from "w3ts";
import { Players } from "w3ts/globals";
import { addScriptHook, W3TS_HOOK } from "w3ts/hooks";

const BUILD_DATE = compiletime(() => new Date().toUTCString());
const TS_VERSION = compiletime(() => require("typescript").version);
const TSTL_VERSION = compiletime(() => require("typescript-to-lua").version);

function tsMain() {
  new Timer().start(1.00, false, () => {
    
    Initialize();

    DestroyTimer(GetExpiredTimer());
  });
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, tsMain);