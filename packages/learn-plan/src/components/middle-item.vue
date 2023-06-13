<template>
  <div>mallItem</div>
  <SmallItem />
  <!-- <div class="total-card">
    <el-row>
      <el-col :span="9">
        <SmallItem :options="data" />
      </el-col>
      <el-col :span="14">
        <div class="card-content">
          <div class="card-full">
            <div
              class="info-line"
              v-for="(item, index) in data.modules"
              :key="index"
            >
              <div class="circle"></div>
              <div class="name">{{ item.name || '-' }}</div>
              <div class="num">{{ item.value || '-' }}</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div> -->
</template>

<script lang="ts" setup>
// import { computed, defineProps, defineEmits } from 'vue';
import SmallItem from './small-item.vue';

// const props = defineProps(['data']);

// const options = computed(() => {
//   return {
//     width: '0%',
//     background: '#0061FF',
//   };
// });
</script>

<style scoped>
.card-img {
  width: 15px;
  height: 18px;
  margin-left: 4px;
}
.total-card {
  height: 184px;
  background: #ffffff;
  border-radius: 4px;
  padding-left: 20px;
  width: 100%;
  color: #333333;
}

.card-content {
  margin-top: 26px;
  margin-bottom: 26px;
  height: 92px;
  display: flex;
  align-items: center;
}

.card-info {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 92px;
  width: 100%;
}
.card-title {
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.value-item {
  font-size: 14px;
  margin-top: 6px;
  height: 45px;
  display: flex;
  align-items: flex-end;
}
.num {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: -4px;
  color: #333333;
}

.click-num:hover {
  color: var(--el-link-hover-text-color);
}

.circle {
  width: 8px;
  height: 8px;
  background: #0061ff;
  border-radius: 8px;
  margin-right: 10px;
}

.icon-font {
  margin-left: 4px;
  background: linear-gradient(180deg, #51aeff 0%, #5669fe 100%);
  color: transparent;
  background-clip: text;
  font-size: 16px;
}

.card-full {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 14px;
  width: 100%;
  height: 100%;
}

.info-line {
  padding-bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.name {
  width: 140px;
  font-size: 14px;
  font-weight: 400;
  color: #666666;
}

.num {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  text-align: right;
  margin-right: 8px;
}

.unit {
  font-size: 14px;
  font-weight: 400;
  color: #666666;
}
.mt2 {
  margin-top: 2px;
}
</style>
