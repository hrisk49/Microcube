import {Component, OnInit} from '@angular/core';
import Highcharts from 'highcharts';
import 'highcharts/highcharts-3d';
import {HighchartsChartModule} from 'highcharts-angular';
import {ButtonActions} from '../../../../shared/constant/button-actions';

@Component({
  selector: 'app-dashboard',
  imports: [
    HighchartsChartModule
  ],
  templateUrl: './dashboard.html',
  standalone: true,
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  pieColors = [
    // Soft Neutrals & Calm Tones
    '#B2F5EA', // Soft Teal
    '#A0AEC0', // Cool Gray
    '#FFC4B9', // Light orange
    '#C5BCF7', // Light Violet
    '#CBD5E0', // Light Gray
    '#C6F6D5', // Mint Green
    '#FED7E2', // Soft Pink
    '#FAF089', // Pale Yellow
    '#E2E8F0', // Off White Gray

    // Blue Shades
    // '#1E3A8A', // Dark Blue
    // '#3B82F6', // Medium Blue
    // '#60A5FA', // Soft Blue
    // '#BFDBFE', // Light Sky Blue
    // '#E0F2FE', // Pale Blue
  ];
  barColors = [
    '#4C6EF5', // Soft Indigo
    '#6C8EBF', // Muted Blue
    '#A0C4FF', // Soft Sky Blue
    '#BDB2FF', // Muted Purple
    '#FFDAC1', // Soft Peach
    '#FFB5A7', // Light Coral
    '#C8E6C9', // Minty Green
    '#DDE5B6', // Light Olive
    '#F0EFEB',  // Off-white Beige
  ];
  Highcharts: typeof Highcharts = Highcharts;

  constructor() {
  }

  ngOnInit(): void {
    ButtonActions.set({
      save: true,
      update: false,
      view: true,
      delete: true,
      exit: true,
      reset: true
    });
  }

  chartOptionsPie: Highcharts.Options = {
    colors: this.pieColors,
    chart: {
      type: 'pie',
      height: '60%',
      backgroundColor: 'transparent',
      options3d: {
        enabled: true,
        alpha: 55,
        beta: 0,
      },
    },
    title: {text: ''},
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'bottom',
      y: 0,
      itemStyle: {
        color: '#333',
      },
    },
    plotOptions: {
      pie: {
        minSize: 0, // Ensures even small values are visible
        ignoreHiddenPoint: false, // Ensures small values are not ignored
        showInLegend: true,
        // colors: ['#19FB8B', '#FF645B'],
        innerSize: 90,
        depth: 40,
        dataLabels: {enabled: true, format: '{point.name}: {point.y}'},
      },
    },
    series: [{
      type: 'pie',
      name: 'Total Deposit',
      data: [
        ['Savings', 400000],
        ['Current', 300000],
        ['Fixed Deposit', 500000],
        ['Recurring', 200000]
      ]
    }],
    credits: {
      enabled: false,
    },
  };

  chartOptionsBar: Highcharts.Options = {
    colors: this.barColors,
    chart: {
      type: 'column',
      height: '60%',
      backgroundColor: 'transparent',
    },
    title: {
      text: '',
      align: 'left',
    },
    xAxis: {
      categories: ['Revenue', 'Expenses', 'Profit']
    },
    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: 'Amount (in Millions)'
      }
    },
    tooltip: {
      pointFormat: '<b>{x}</b><br/>{series.name}: ৳{y}M<br/>Total: ৳{point.stackTotal}M'
    },
    plotOptions: {
      column: {
        stacking: 'normal'
      }
    },
    series: [
      {
        name: 'Dhanmondi Branch',
        data: [85000, 60000, 20000],
        stack: 'SME Branch'
      },
      {
        name: 'Gulshan Branch',
        data: [78000, 58000, 17000],
        stack: 'SME Branch'
      },
      {
        name: 'Banani Branch',
        data: [65000, 50000, 12000],
        stack: 'Corporate Branch'
      },
      {
        name: 'Savar Branch',
        data: [62000, 47000, 18000],
        stack: 'Corporate Branch'
      }
    ] as Highcharts.SeriesColumnOptions[],
    credits: {
      enabled: false
    }
  };

}
