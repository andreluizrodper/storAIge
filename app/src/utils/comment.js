import { v4 as uuidv4 } from "uuid";
import store from "@/store";

const collection = "comment";
const api = "https://api.couplingbetter.com";

const createComment = async ({ data }) => {
  try {
    const uuid = uuidv4();
    data.uuid = uuid;
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

const updateComment = async ({ id, data }) => {
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

const getComment = async ({ where, limit }) => {
  return await fetch(`${api}/firebase/get`, {
    body: JSON.stringify({
      collection,
      where: [
        {
          field: "archived",
          operator: "==",
          value: false,
        },
        ...where,
      ],
      order: [{ field: "created_at", type: "DESC" }],
      limit,
    }),
    method: "POST",
    headers: {
      "content-type": "application/json",
      From: "mail-monster",
    },
  }).then((res) => res.json());
};

const countComment = async ({ where, limit }) => {
  return await fetch(`${api}/firebase/count`, {
    body: JSON.stringify({
      collection,
      where: [
        {
          field: "archived",
          operator: "==",
          value: false,
        },
        ...where,
      ],
      order: [{ field: "created_at", type: "DESC" }],
      limit,
    }),
    method: "POST",
    headers: {
      "content-type": "application/json",
      From: "mail-monster",
    },
  }).then((res) => res.json());
};

export { createComment, updateComment, getComment, countComment };
