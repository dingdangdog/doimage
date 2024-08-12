<template>
  <div class="image-div">
    <v-img
      :src="image"
      aspect-ratio="1"
      class="image bg-grey-lighten-2"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" justify="center" align="center">
          <v-progress-circular
            color="grey-lighten-5"
            indeterminate
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
  </div>

</template>

<script setup lang="ts">
const { image } = defineProps(["image"]);
console.log(image)
</script>

<style scoped>
.image-div {
  margin: 0.5rem;
  width: 10rem;
  height: 8rem;
  border: 1px solid #f6467c;
  border-radius: 0.2rem;
}

.image {
  padding: 0.5rem;
  border-radius: 0.2rem;
  cursor: pointer;
}
</style>
