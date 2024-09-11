import { v4 as uuidv4 } from "uuid";
import { getCouple } from "./couple";
import store from "@/store";

const collection = "account";
const api = "https://api.couplingbetter.com";

const updateAccount = async ({ id, data }) => {
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

const createAccount = async ({ data, setStore = true }) => {
  try {
    const uuid = uuidv4();
    data.uuid = uuid;
    await fetch(`${api}/firebase`, {
      body: JSON.stringify({
        collection,
        data,
      }),
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((data) => data.json())
      .then(async (res) => {
        if (setStore) await getAccount({ id: res.id });
      });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const getAccount = async ({ id, setStore = true }) => {
  return await fetch(`${api}/firebase/single`, {
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
      if (setStore) store.commit("setAccount", res);
      return res;
    });
};

const accountExists = async ({ owner }) => {
  const accountExist = await fetch(`${api}/firebase/get`, {
    body: JSON.stringify({
      collection,
      where: [{ field: "owner", operator: "==", value: owner }],
    }),
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((data) => data.json())
    .then((res) => {
      return !res.empty;
    });
  return accountExist;
};

const loginAccount = async ({ id }) => {
  try {
    console.log(id);
    await fetch(`${api}/firebase/get`, {
      body: JSON.stringify({
        collection,
        where: [{ field: "owner", operator: "==", value: id }],
      }),
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((data) => data.json())
      .then(async (res) => {
        const account = res[0];
        store.commit("setAccount", account);

        const couple = await getCouple({ id: account.couple_id });
        const otherHalfId = couple.accounts.filter(
          (account_id) => account_id !== account.id
        )[0];

        const otherHalfAccount = await getAccount({
          id: otherHalfId,
          setStore: false,
        });
        store.commit("setOtherHalfAccount", otherHalfAccount);
      });
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const getAccountByEmail = async ({ email }) => {
  try {
    const account = await fetch(`${api}/firebase/get`, {
      body: JSON.stringify({
        collection,
        where: [{ field: "email", operator: "==", value: email }],
      }),
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    }).then((data) => data.json());
    return account;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export {
  accountExists,
  getAccountByEmail,
  updateAccount,
  createAccount,
  getAccount,
  loginAccount,
};
