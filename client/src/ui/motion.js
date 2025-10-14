export const fadeUp = { hidden:{opacity:0,y:12}, visible:{opacity:1,y:0,transition:{duration:.22,ease:'easeOut'}} };
export const list = { hidden:{opacity:0}, visible:{opacity:1, transition:{staggerChildren:.07}} };
export const item = { hidden:{opacity:0,y:8}, visible:{opacity:1,y:0, transition:{duration:.2}} };
export const dialog = { hidden:{opacity:0,scale:.96}, visible:{opacity:1,scale:1,transition:{duration:.24,ease:'easeOut'}}, exit:{opacity:0,scale:.98,transition:{duration:.16}} };