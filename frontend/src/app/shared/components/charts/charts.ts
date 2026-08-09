import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ChartData {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './charts.html',
  styleUrls: ['./charts.css']
})
export class ChartsComponent implements OnChanges {
  @Input() data: ChartData[] = [];
  @Input() title = '';
  @Input() type: 'doughnut' | 'bar' = 'doughnut';

  total = 0;
  hoveredIndex: number | null = null;
  tooltip: { x: number; y: number; text: string } | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.total = this.data.reduce((sum, d) => sum + d.value, 0);
    }
  }

  getDoughnutSegments(): { path: string; color: string; label: string; value: number; percentage: number }[] {
    const segments: { path: string; color: string; label: string; value: number; percentage: number }[] = [];
    let currentAngle = -90;
    const radius = 70;
    const cx = 100;
    const cy = 100;

    this.data.forEach(item => {
      if (item.value === 0) return;
      const percentage = (item.value / this.total) * 100;
      const angle = (item.value / this.total) * 360;
      const startAngle = (currentAngle * Math.PI) / 180;
      const endAngle = ((currentAngle + angle) * Math.PI) / 180;
      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);
      const largeArc = angle > 180 ? 1 : 0;
      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      segments.push({ path, color: item.color, label: item.label, value: item.value, percentage: Math.round(percentage * 10) / 10 });
      currentAngle += angle;
    });
    return segments;
  }

  getBarMax(): number {
    return Math.max(...this.data.map(d => d.value), 1);
  }

  getBarPercentage(value: number): number {
    if (this.total === 0) return 0;
    return Math.round((value / this.total) * 100 * 10) / 10;
  }

  showTooltip(event: MouseEvent, label: string, value: number, percentage: number): void {
    this.tooltip = { x: event.offsetX + 10, y: event.offsetY - 30, text: `${label}: ${value} (${percentage}%)` };
  }

  hideTooltip(): void {
    this.tooltip = null;
  }
}
