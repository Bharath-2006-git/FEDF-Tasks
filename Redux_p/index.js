const { createStore } = require("redux")

const initalState = {
    numOfLaptops: 120,
    numOfMobiles: 300
};

const buyLaptop = () => ({
    type: "BUY_LAPTOP"
});

const buyMobile = () => ({
    type: "BUY_MOBILE"
});

const reducer = (state = initalState, action) => {
    switch (action.type) {
        case "BUY_LAPTOP":
            return {
                ...state,
                numOfLaptops: state.numOfLaptops - 1
            };
        case "BUY_MOBILE":
            return {
                ...state,
                numOfMobiles: state.numOfMobiles - 1
            };
        default:
            return state;
    }
};

const store = createStore(reducer);
store.subscribe(() => {
    console.log(store.getState());
});

store.dispatch(buyLaptop());
store.dispatch(buyMobile());