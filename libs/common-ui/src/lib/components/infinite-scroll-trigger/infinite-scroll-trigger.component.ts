import { Component, OnInit, output } from '@angular/core';

@Component({
  selector: 'app-infinite-scroll-trigger',
  imports: [],
  templateUrl: './infinite-scroll-trigger.component.html',
  styleUrl: './infinite-scroll-trigger.component.scss'
})
export class InfiniteScrollTriggerComponent implements OnInit {
  loaded = output();

  ngOnInit() {
    this.loaded.emit()
  }

}
