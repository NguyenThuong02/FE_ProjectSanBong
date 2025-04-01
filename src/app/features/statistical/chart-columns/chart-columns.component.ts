import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill,
  NgApexchartsModule,
  ApexStroke
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-chart-columns',
  standalone: true,
  imports: [
    NgApexchartsModule
  ],
  templateUrl: './chart-columns.component.html',
  styleUrl: './chart-columns.component.scss'
})
export class ChartColumnsComponent implements OnChanges {
  @ViewChild("chart") chart: ChartComponent;
  @Input() listData: any;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Số lượng đơn tháng",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "bar",
        toolbar: {
          show: false 
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: "top" 
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val.toString();
        },
        offsetY: -20,
        style: {
          fontSize: "14px",
          colors: ["#304758"]
        }
      },

      xaxis: {
        categories: [],
        position: "top",
        labels: {
          offsetY: -2
        },
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: true,
          offsetY: -35
        }
      },
      fill: {
        colors: ["#FFB30F"],
        type: "solid"
      },
      yaxis: {
        max: 100,
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: true,
          formatter: function(val) {
            return val.toString();
          }
        }
      },
      title: {
        text: "Biểu đồ cột thống kê số đơn tháng",
        floating: true,
        offsetY: 330,
        align: "center",
        style: {
          color: "#444"
        }
      }
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listData'] && this.listData) {
      const nameOrder = this.listData.map((item: any) => item.name);
      const total = this.listData.map((item: any) => item.total);
      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          ...this.chartOptions?.xaxis,
          categories: nameOrder,
        },
        series: [
          {
            ...this.chartOptions?.series,
            data: total,
          },
        ],
      };
    }
  }
}
