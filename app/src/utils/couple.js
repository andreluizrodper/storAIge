import { v4 as uuidv4 } from "uuid";
import store from "@/store";
import { updateAccount } from "./account";

const collection = "couple";
const api = "https://api.couplingbetter.com";

const updateCouple = async ({ id, data }) => {
  try {
    const restaurant = await fetch(`${api}/firebase`, {
      body: JSON.stringify({
        collection,
        id,
        data,
      }),
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
    }).then((data) => data.json());
    return restaurant;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const createCouple = async () => {
  try {
    const uuid = uuidv4();
    const couple = await fetch(`${api}/firebase`, {
      body: JSON.stringify({
        collection,
        data: {
          accounts: [store.state.createCouple, store.state.account.id],
          status: true,
          uuid,
        },
      }),
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    }).then((data) => data.json());
    await updateAccount({
      id: store.state.createCouple,
      data: { inCouple: true, couple_id: couple.id },
    });
    await updateAccount({
      id: store.state.account.id,
      data: { inCouple: true, couple_id: couple.id },
    });
    return couple;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const getCouple = async ({ id }) => {
  return await fetch(`${api}/firebase/get`, {
    body: JSON.stringify({
      collection,
      id,
    }),
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((data) => data.json())
    .then((res) => {
      return res[0];
    });
};

export { createCouple, getCouple, updateCouple };
