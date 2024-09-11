<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template v-for="(item, index) in items" :key="index">
        <BreadcrumbSeparator v-if="index > 0" />
        <BreadcrumbItem>
          <BreadcrumbLink v-if="item.link">
            <router-link :to="item.link">
              <Icon v-if="item.icon" class="size-4" :name="item.icon" />
              {{ item.text }}
            </router-link>
          </BreadcrumbLink>
          <span v-else>
            <Icon v-if="item.icon" class="size-4" :name="item.icon" />
            {{ item.text }}
          </span>
        </BreadcrumbItem>
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>

<script>
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Icon from "@/components/ui/icon.vue";

export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    Icon,
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  },
};
</script>
