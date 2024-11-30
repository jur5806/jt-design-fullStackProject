<template>
  <div class="chart-box">
    <ul class="legends">
      <li v-for="(item,i) in series" :key="i">
        <i :style="{background:item.color1}"></i>
        <span>{{item.name}}</span>
      </li>
    </ul>
    <div class="chart2"></div>
  </div>
</template>

<script setup lang="ts">
import {reactive,ref,onMounted} from 'vue'
import * as echarts from 'echarts'

let chart = ref(null as any)//echarts实例
let series = reactive([{
            type: 'bar',
            name: '供方信息',
            data: [300, 200, 320, 340],
            color1: 'rgba(78, 231, 251, 1)',
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
          },
          {
            type: 'bar',
            name: '需方信息',
            data: [100,120,180,60],
            color1: 'rgba(106, 245, 169, 1)',
            barWidth: '5%',
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(106, 245, 169, 1)'
              },
              {
                offset: 1,
                color: 'rgba(0, 51, 23, 1)'
              }
            ], false),
            lineStyle: {
              width: 1.5
            }
          }
        ])


onMounted(()=>{
  drawChart()
  window.addEventListener('resize', () => {
    if (chart) {
      chart.resize();
    }
  })
})
const drawChart =()=> {
        chart = echarts.init(document.querySelector('.chart2') as HTMLElement)
        chart.setOption({
          grid: {
            right: '0%',
            bottom: '8%',
            left: '8%',
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
            formatter: params => {
              let str = ''
              params.forEach((item, i) => {
                str += `<div style="font-size:.12rem;">
                <span style="display:inline-block;margin-right:.03rem;border-radius:.06rem;width:.06rem;height:.06rem;background-color:${item.color};"></span>
                <span style="margin-right:.05rem;font-size:.12rem;">${item.seriesName}</span>
                <span style="font-size:.12rem;">${item.value} 项</span> 
                </div>`
              })
              return str;

            },
            textStyle: {
              fontSize: '50%'
            }
          },
          xAxis: {
            type: 'category',
            data: ['第一季度', '第二季度', '第三季度', '第四季度'],
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: '#A2C3E0',
              fontSize: '75%',
              fontFamily: 'PingFang SC'
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
            name: '项',
            nameTextStyle: {
              color: '#A2C3E0'
            },
            min: 0,
            // max:  this.optionData.max,
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
      }
</script>

<style scoped lang="scss">
.chart,
  .chart-box {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .legends {
    position: absolute;
    left: 50%;
    top:10px;
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
        margin-right: 4px;
      }

      span {
        font-size: 12px;
        color: #CCE7FF;
        word-break: keep-all
      }
    }
  }

</style>