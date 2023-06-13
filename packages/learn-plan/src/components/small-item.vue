<template>
  <!-- <el-card class="block"> -->
  <div class="title">
    {{ options.title }}
  </div>
  <!-- <div style="padding-top: 15px">
      <div style="display: flex; justify-content: space-between">
        <div>{{ options.func.title }}</div>
        <div>-</div>
      </div>
    </div>
    <div class="progress-item">
      <div class="progress-data"></div>
    </div>
    <div>
      <div
        style="display: flex; justify-content: space-between; margin-top: 14px"
      >
        <div>{{ options.progress.title }}</div>
        <div v-if="options.progress.denominator">
          {{ options.progress.molecule }}/{{ options.progress.denominator }}
        </div>
        <div v-else>-</div>
      </div>
    </div>
    <div class="progress-item">
      <div class="progress-data"></div>
    </div> -->
  <!-- </el-card> -->
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue';
// 图下钻暂存
const props = defineProps(['options']);
// onMounted(() => {
//   initData({});
// });
const funcStyles = computed(() => {
  return {
    width: getWith(props.options.func),
    background: '#0061FF',
  };
});
const progressStyles = computed(() => {
  return {
    width: getWith(props.options.progress),
    background: '#0061FF',
  };
});

function getWith(item) {
  if (item && item.molecule && item.denominator) {
    return (item.molecule / item.denominator) * 100 + '%';
  } else {
    return '0%';
  }
}
</script>
<style scoped>
.block {
  margin: 20px 5px 0 5px;
  padding: 14px 20px;
  width: 207px;
  height: 142px;
  border-radius: 4px;
  color: #333;
  border: 0;
  background: #ffffff;
  font-size: 12px;
}

.title {
  height: 22px;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 22px;
}

.progress-item {
  margin-top: 6px;
  height: 6px;
  width: 100%;
  border-radius: 2px;
  background: #e8e8e8;
  font-size: 12px;
  color: #333333;
  overflow: hidden;
}

.progress-data {
  height: 6px;
  border-radius: 2px;
}
</style>
