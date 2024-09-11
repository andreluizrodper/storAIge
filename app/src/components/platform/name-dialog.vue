<template>
  <div
    class="fixed top-0 z-30 bottom-0 left-0 right-0 bg-green-500 flex items-center justify-center"
  >
    <Card class="w-96 shadow-md">
      <div class="flex justify-center py-6">
        <Logo />
      </div>
      <CardHeader>
        <CardTitle>Oi! Tudo bem?</CardTitle>
        <CardDescription
          >Vamos primeiro pegar uma foto sua e o seu nome.</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form @submit.prevent="save" class="flex flex-col gap-8">
          <div class="relative overflow-hidden flex justify-center">
            <img
              v-if="avatar"
              :src="avatar"
              class="object-cover object-center size-24 rounded-full"
            />
            <div
              v-if="!avatar"
              class="size-24 rounded-full bg-gray-50 border flex items-center justify-center text-gray-500"
            >
              <Camera v-if="!uploading" size="26" />
              <Loading v-if="uploading" />
            </div>
            <vueDropzone
              ref="imgDropzone"
              id="dropzone"
              :options="dropzoneOptions"
              @vdropzone-complete="afterComplete"
              class="w-full absolute cursor-pointer opacity-0 top-0 right-0 bottom-0 left-0"
            />
          </div>
          <div class="flex flex-col gap-2">
            <Input v-model="name" placeholder="Seu nome" />
          </div>
          <div class="flex justify-end">
            <Button :disabled="!isValid" class="flex gap-2">
              <Loading v-if="loading" />
              Salvar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script>
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAccount, updateAccount } from "@/utils/account";
import Logo from "@/components/ui/logo.vue";
import Loading from "@/components/ui/loading.vue";
import vueDropzone from "dropzone-vue3";
import { v4 as uuidv4 } from "uuid";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Camera } from "lucide-vue-next";

export default {
  components: {
    Loading,
    Logo,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    Label,
    Input,
    Button,
    vueDropzone,
    Camera,
  },
  computed: {
    isValid() {
      return this.name.length > 2;
    },
    account() {
      return this.$store.state.account;
    },
  },
  data() {
    return {
      name: "",
      avatar: "",
      loading: false,
      uploading: false,
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 150,
        thumbnailHeight: 150,
        useCustomSlot: true,
        addRemoveLinks: false,
        acceptedFiles: "image/*,application/pdf",
      },
    };
  },
  methods: {
    async afterComplete(file) {
      try {
        this.uploading = true;
        const storage = getStorage();
        const file_ext = file.name.split(".").pop();
        const imageName = uuidv4();
        this.storageRef = ref(
          storage,
          `${this.account.id}/avatar/${imageName}.${file_ext}`
        );
        this.upload = true;
        uploadBytes(this.storageRef, file).then(() => {
          getDownloadURL(this.storageRef).then((url) => {
            this.avatar = url;
            this.$refs.imgDropzone.removeFile(file);
            this.uploading = false;
          });
        });
      } catch (error) {
        console.log(error);
      }
    },
    async save() {
      if (!this.isValid) return;
      this.loading = true;
      await updateAccount({
        id: this.account.id,
        data: {
          name: this.name,
          avatar: this.avatar,
        },
      });
      await getAccount({
        id: this.account.id,
      });
    },
  },
};
</script>
