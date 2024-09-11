<template>
  <div>
    <Button variant="outline" @click="open = true">Nova memória</Button>
    <Dialog v-if="open" :open="!!open" @update:open="toggleOpen">
      <DialogContent class="grid-rows-[auto_minmax(0,1fr)_auto] max-h-[90dvh]">
        <DialogHeader>
          <DialogTitle>Criando uma nova memória</DialogTitle>
          <DialogDescription> Adicione as fotos abaixo </DialogDescription>
          <div class="flex gap-4">
            <div class="flex-1">
              <Input
                v-model="title"
                placeholder="Como é o nome dessa memória?"
              />
            </div>
            <div class="relative overflow-hidden flex justify-center">
              <Button>
                <div class="flex items-center gap-4">
                  <Loading v-if="uploading" />
                  <Image v-if="!uploading" size="16" />
                  <span>Add photos</span>
                </div>
              </Button>
              <vueDropzone
                ref="imgDropzone"
                id="dropzone"
                :options="dropzoneOptions"
                @vdropzone-complete="afterComplete"
                class="w-full absolute cursor-pointer opacity-0 top-0 right-0 bottom-0 left-0"
              />
            </div>
          </div>
        </DialogHeader>
        <div
          v-if="photos.length === 0"
          class="py-12 flex items-center justify-center text-gray-400"
        >
          Nenhuma imagem ainda =[
        </div>
        <div class="grid grid-cols-2 gap-2 overflow-y-auto">
          <div
            v-for="photo in photos"
            :key="photo.uuid"
            class="border rounded relative"
          >
            <button
              @click="removeImage(photo.uuid)"
              class="absolute top-0 right-0 bg-white px-3 py-2"
            >
              <Trash size="14" />
            </button>
            <img
              :src="photo.url"
              class="h-56 w-56 object-cover object-center"
            />
          </div>
        </div>
        <div class="flex justify-between">
          <Button variant="outline" @click="open = false">Cancel</Button>
          <Button @click="save" :disabled="loading || photos.length === 0">
            <div class="flex items-center gap-2">
              <Loading v-if="loading" />
              Create
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script>
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogScrollContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import vueDropzone from "dropzone-vue3";
import { v4 as uuidv4 } from "uuid";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Loading from "@/components/ui/loading.vue";
import { DateTime } from "luxon";
import { Image, Trash } from "lucide-vue-next";
import { createGallery } from "@/utils/gallery";

export default {
  components: {
    Image,
    Input,
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogScrollContent,
    vueDropzone,
    Loading,
    Trash,
  },
  data() {
    return {
      title: "",
      photos: [],
      open: false,
      loading: false,
      uploading: false,
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        multiple: true,
        thumbnailWidth: 150,
        thumbnailHeight: 150,
        useCustomSlot: true,
        addRemoveLinks: false,
        acceptedFiles: "image/*,application/pdf",
      },
    };
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
  },
  methods: {
    removeImage(uuid) {
      const index = this.photos.find((photo) => uuid === photo.uuid);
      this.photos.splice(index, 1);
    },
    toggleOpen() {
      this.open = false;
    },
    async afterComplete(file) {
      try {
        this.uploading = true;
        const storage = getStorage();
        const file_ext = file.name.split(".").pop();
        const imageName = uuidv4();
        this.storageRef = ref(
          storage,
          `${this.account.id}/memories/${imageName}.${file_ext}`
        );
        this.upload = true;
        uploadBytes(this.storageRef, file).then((image) => {
          console.log(image);
          getDownloadURL(this.storageRef).then((url) => {
            this.photos.push({
              uuid: imageName,
              url,
              created_at: DateTime.now().toFormat("dd/MM/YYYY h:m"),
              created_by: this.account,
            });
            this.$refs.imgDropzone.removeFile(file);
            this.uploading = false;
          });
        });
      } catch (error) {
        console.log(error);
      }
    },
    async save() {
      this.loading = true;
      await createGallery({
        id: this.account.id,
        data: {
          title: this.title,
          photos: this.photos,
        },
      });
      this.$emit("updateFeed");
      this.open = false;
      this.loading = false;
    },
  },
};
</script>
