<template>
  <div class="chart-box">
    <div class="chart" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts';

let chart = ref(null as any);
let interval = ref(null as any);
let dataIndex = ref(0);
let series = reactive([{
  type: 'bar',
  name: '发布情况',
  data: [300, 200, 320, 340],
  barWidth: '5%',
  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
    offset: 0,
    color: 'rgba(73, 216, 244, 1)'
  },
  {
    offset: 1,
    color: 'rgba(0, 60, 67, 1)'
  }
  ], false),
  lineStyle: {
    width: 1.5
  }
}
]);


const drawChart = ():any => {
  chart = echarts.init(document.querySelector('.chart') as HTMLDivElement)
  chart.setOption({
    grid: {
      right: '2%',
      bottom: '12%',
      left: '12%',
      top: '18%'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: 'rgba(255,255,255,.1)'
        }
      },
      textStyle: {
        fontSize: '50%'
      }
    },
    xAxis: {
      type: 'category',
      data: ['第一季度', '第二季度', '第三季度', '第四季度'],
      axisLabel: {
        color: '#A2C3E0',
        fontSize: '75%',
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: 'rgba(2, 207, 233, .15)'
        }
      },
    },
    yAxis: [{
      type: 'value',
      position: 'left',
      name: '次',
      nameTextStyle: {
        color: '#A2C3E0'
      },
      min: 0,
      axisLine: {
        show: false,
        lineStyle: {
          color: '#fff'
        }
      },
      axisLabel: {
        fontSize: '70%',
        fontFamily: 'PingFang SC',
        color: '#A2C3E0'
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(2, 207, 233, .15)'
        }
      },
    }],
    series: series
  })
  // move()
}
onMounted(()=>{
  drawChart()
  window.addEventListener('resize', () => {
    if (chart) {
      chart.resize();
    }
  })
  
})

const move = () => {
  interval = setInterval(() => {
    (chart).dispatchAction({
      type: "downplay",
      seriesIndex: 0,
      dataIndex: dataIndex.value
    });
    if (dataIndex.value == (series[0].data.length - 1)) {
      dataIndex.value = -1
    }
    dataIndex.value++
    chart.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: dataIndex.value
    });
    chart.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: dataIndex.value
    });
  }, 2000);
};



onBeforeUnmount(() => {
  if (chart) {
    chart.clear();
    chart = null
  }
  if (interval.value) {
    clearInterval(interval.value);
  }
})
</script>
<style lang='scss' scoped>
.chart,
.chart-box {
  width: 100%;
  height: 100%;
  position: relative;
}

.legends {
  position: absolute;
  left: 50%;
  top: 10px;
  transform: translateX(-30%);
  display: flex;

  li {
    display: flex;
    align-items: center;
    margin-left: 15px;
    white-space: nowrap;

    i {
      display: block;
      width: 18px;
      height: 5px;
      // border-radius: 50%;
      margin-right: 4px;
    }

    span {
      font-size: 12px;
      color: #CCE7FF;
      font-family: PingFang SC;
      word-break: keep-all
    }
  }
}
</style>
