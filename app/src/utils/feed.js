import { v4 as uuidv4 } from "uuid";
import store from "@/store";

const collection = "feed";
const api = "https://api.couplingbetter.com";

const createFeed = async ({ data }) => {
  try {
    const uuid = uuidv4();
    data.uuid = uuid;
    data.couple_id = store.state.account.couple_id;
    data.created_by = store.state.account;
    await fetch(`${api}/firebase`, {
      body: JSON.stringify({
        collection,
        data,
      }),
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    }).then((data) => data.json());
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const updateFeed = async ({ id, data }) => {
  try {
    await fetch(`${api}/firebase`, {
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
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const getFeed = async () => {
  return await fetch(`${api}/firebase/get`, {
    body: JSON.stringify({
      collection,
      where: [
        {
          field: "archived",
          operator: "==",
          value: false,
        },
        {
          field: "couple_id",
          operator: "==",
          value: store.state.account.couple_id,
        },
      ],
      order: [{ field: "created_at", type: "DESC" }],
      limit: 15,
    }),
    method: "POST",
    headers: {
      "content-type": "application/json",
      From: "mail-monster",
    },
  }).then((res) => res.json());
};

const getFeedSingle = async ({ id }) => {
  return await fetch(`${api}/firebase/single`, {
    body: JSON.stringify({
      collection,
      id,
    }),
    method: "POST",
    headers: {
      "content-type": "application/json",
      From: "mail-monster",
    },
  }).then((res) => res.json());
};

export { createFeed, getFeed, updateFeed, getFeedSingle };
