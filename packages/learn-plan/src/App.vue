<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <Overview analysis="数学" />
  <SmallItem />
  <el-row gutter="24" class="block" style="margin: -5px">
    <el-col
      v-for="(item, index) in developOptions.data"
      :key="index"
      :span="12"
      class="item-align"
    >
      <MiddleItem :data="item" />
    </el-col>
  </el-row>

  <overview analysis="质量" style="margin: 20px 0 14px -7px" />
  <el-card class="quality-block">
    <div class="tag-item">
      <div class="tag-item-child soft">软件</div>
    </div>
    <div style="display: flex">
      <div v-for="(item, index) in qualitySoftOptions.data" :key="index">
        <SmallItem :options="item" />
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';
import Overview from './components/over-view.vue';
import SmallItem from './components/small-item.vue';

const developOptions = ref({
  data: [
    {
      title: '软件',
      func: {
        title: '功能方案评审',
        molecule: 0,
        denominator: 0,
      },
      progress: {
        title: '功能开发进度',
        molecule: 0,
        denominator: 0,
      },
      modules: [
        {
          name: '软件正式版本进展',
          value: '集成测试中',
          molecule: 0,
          denominator: 0,
        },
      ],
    },
    {
      title: '硬件',
      func: {
        title: '功能方案评审',
        molecule: 0,
        denominator: 0,
      },
      progress: {
        title: '功能开发进度',
        molecule: 0,
        denominator: 0,
      },
      modules: [
        {
          name: '硬件研发进展',
          value: '制版',
          molecule: 0,
          denominator: 0,
        },
        {
          name: '结构进展',
          value: 'TG2-数据冻结',
          molecule: 0,
          denominator: 0,
        },
      ],
    },
  ],
});

// 质量 软件数据
const qualitySoftOptions = ref({
  data: [
    {
      title: '工程验收',
      func: {
        title: '验收进展',
        molecule: 0,
        denominator: 0,
      },
      progress: {
        title: 'DI',
        molecule: 0,
        denominator: 0,
      },
    },
    {
      title: '产品验收',
      func: {
        title: '验收进展',
        molecule: 0,
        denominator: 0,
      },
      progress: {
        title: 'DI',
        molecule: 0,
        denominator: 0,
      },
    },
    {
      title: 'PTC验收',
      func: {
        title: '验收进展',
        molecule: 0,
        denominator: 0,
      },
      progress: {
        title: 'DI',
        molecule: 0,
        denominator: 0,
      },
    },
    {
      title: '集成测试',
      func: {
        title: '验收进展',
        molecule: 0,
        denominator: 0,
      },
      progress: {
        title: 'DI',
        molecule: 0,
        denominator: 0,
      },
    },
    {
      title: '工单',
      func: {
        title: '验收进展',
        molecule: 0,
        denominator: 0,
      },
      progress: {
        title: 'DI',
        molecule: 0,
        denominator: 0,
      },
    },
  ],
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #f6f8fa;
  margin-top: 60px;
}
</style>
