<script setup lang="js">
import axios from "axios";
import { useAuthStore } from "~/stores/auth.store.js";
import { useRouter } from "vue-router";
const BASE_URL = 'http://localhost:3002'
const authStore = useAuthStore();
const router = useRouter();



const users = ref([]);
const user = ref(null);

const status = computed(() => authStore.status)

const api = null;

const successMessage = ref("")
const errorMessage = ref("")

function axiosInit() {

}

function redirectToAuth() {
  router.push("/");
}

async function refresh() {
  await authStore.refresh()
}

function handleError() {
  errorMessage.value = error.message;
}

async function withHandledErrors(callback) {

  const withRefresh = async (callback) => {
    try {
      return await callback();
    } catch (error) {
      if (error.response?.status === 401) {

        ///
        await refresh();
        ///

        return await callback();
      }
      throw error;
    }
  }

  const handleCommonErrors = (error) => {
    const status = error.response?.status;
    if (status === 401) {
      ///
      redirectToAuth()
      ///
      throw new Error("Unauthorized!")
    } else if (status === 403) {
      throw new Error("Insuficient permissions!");
    } else if (status === 404) {
      throw new Error("User not found!");
    } else if (status > 499) {
      throw new Error("Server error!")
    } else {
      const message = error.message || "Something went wrong";
      throw new Error(message);
    }
  }

  try {
    return await withRefresh(callback)
  } catch (error) {
    handleCommonErrors(error);
  }
}

async function getUsers(baseUrl) {

  const token = authStore.getToken();

  const get = async () => {
    const url = `${baseUrl}/admin/users`
    const config = { headers: { Authorization: token }, withCredentials: true }

    const response = await axios.get(url, config)
    return response.data.data.users;
  }
  try {
    const res = await withHandledErrors(get);

    ///
    users.value = res;
    ///

    return res;
  } catch (error) {

    ///
    errorMessage.value = error.message;
    ///

  }
}




async function getUserById(baseUrl, id) {
  const token = authStore.getToken();

  const get = async () => {
    const url = `${baseUrl}/admin/users/id/${id}`
    const config = { headers: { Authorization: token }, withCredentials: true }

    const response = await axios.get(url, config)
    return response.data?.data?.user;
  }

  try {
    const res = await withHandledErrors(get);

    ///
    user.value = res;
    ///

    return res;
  } catch (error) {

    ///
    errorMessage.value = error.message;
    ///

  }
}


async function getUserByEmail(baseUrl, email) {
  const token = authStore.getToken();

  const get = async () => {
    const url = `${baseUrl}/admin/users/email/${email}`
    const config = { headers: { Authorization: token }, withCredentials: true }

    const response = await axios.get(url, config)
    return response.data?.data?.user;
  }

  try {
    const res = await withHandledErrors(get);
    ///
    user.value = res;
    ///
    return res;
  } catch (error) {
    ///
    errorMessage.value = error.message;
    ///
  }
}

async function banUser(baseUrl, id, reason = "") {

  const token = authStore.getToken();

  const ban = async () => {
    const url = `${baseUrl}/admin/users/${id}/ban`
    const body = { reason };
    const config = { headers: { Authorization: token }, withCredentials: true }

    const response = await axios.patch(url, body, config)
    return response;
  }

  try {
    const res = await withHandledErrors(ban);

    if (res.data?.data?.user?.status === "banned") {
      const bannedUser = res.data.data.user;

      ///
      const i = users.value.findIndex(user => user.id === bannedUser.id);
      if (i >= 0) {
        users.value[i] = bannedUser;
      }
      ///

      return bannedUser;
    }

  } catch (error) {

    ///
    errorMessage.value = error.message;
    ///

  }

}


async function unbanUser(baseUrl, id, reason = "") {

  const token = authStore.getToken();

  const ban = async () => {
    const url = `${baseUrl}/admin/users/${id}/unban`
    const body = { reason };
    const config = { headers: { Authorization: token }, withCredentials: true }

    const response = await axios.patch(url, body, config)
    return response;
  }
  try {
    const res = await withHandledErrors(ban);
    console.log(res);
    if (res.data?.data?.user?.status === "active") {
      const unbannedUser = res.data.data.user;

      ///
      const i = users.value.findIndex(user => user.id === unbannedUser.id);
      if (i >= 0) {
        users.value[i] = unbannedUser;
      }
      ///

      return unbannedUser;
    }

  } catch (error) {

    ///
    errorMessage.value = error.message;
    ///

  }

}

async function deleteUser(baseUrl, id) {

  const url = `${baseUrl}/admin/users/${id}/delete`
  const token = authStore.getToken();
  const config = { headers: { Authorization: token }, withCredentials: true }

  const del = async () => {
    const response = await axios.delete(url, config)
    console.log(response)
    return response
  }

  try {
    const res = await withHandledErrors(del);

    ///
    if (res.status < 300) {
      const i = users.value.findIndex(user => user.id === id)
      users.value.splice(i, 1);
    }
    ///

    return res;

  } catch (error) {

    ///
    errorMessage.value = error.message;
    ///
  }

}



watch(status, async () => {
  if (status.value === "authenticated") {
    await getUsers(BASE_URL);

    if (users.value) {
      console.log("getting single user")
      const email = users.value[0].email;
      console.log(email)
      user.value = await getUserByEmail(BASE_URL, email);


      console.log("getting single user")
      const id = users.value[0].id;
      console.log(id)
      user.value = await getUserById(BASE_URL, id);
    }

  } else {
    console.log("status", status.value)
  }

})

onMounted(async () => {



})




</script>

<template>

  <div>


    <div class="header" >
        
    </div>

    <div v-if="users" class="w-full flex flex-col">
      <div v-for="user in users" class="flex justify-between max-w-screen-xl">
        <div>
          {{ user.email }}
        </div>
        <div>status {{ user.status }}</div>
        <div class="flex gap-2 p-1 ">
          <div v-if="user.status !== `banned`">
            <button @click="banUser(BASE_URL, user.id)" class="p-4 bg-yellow-500 text-white">Ban User</button>
          </div>
          <div v-if="user.status === `banned`">
            <button @click="unbanUser(BASE_URL, user.id)" class="p-4 bg-green-500 text-white">Unban User</button>
          </div>
          <div>
            <button @click="deleteUser(BASE_URL, user.id)" class="p-4 bg-red-500 text-white">Delete User</button>
          </div>

        </div>
      </div>
    </div>



  </div>
</template>

<style scoped></style>