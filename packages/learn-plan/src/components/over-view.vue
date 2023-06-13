<template>
  <div class="box">
    <div class="title-bold">
      <div class="overview"></div>
      <span class="item-span"> {{ analysis || '研发' }}</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
defineProps(['analysis']);
</script>

<style scoped>
.box {
  margin: 15px 8px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.overview {
  width: 4px;
  height: 20px;
  background: #0061ff;
  display: inline-block;
  border-radius: 4px;
}

.title-bold {
  height: 22px;
  font-size: 18px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
}

.item-span {
  margin-left: 10px;
  font-weight: 600;
}
</style>
