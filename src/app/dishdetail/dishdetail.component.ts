import { Component, OnInit} from '@angular/core';
import { Dish } from '../shared/dish'
import { Params, ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'
import { DishService } from '../services/dish.service'
import { switchMap} from 'rxjs/operators'


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  
 
  dish: Dish;
  dishIds : string[];
  prev: string;
  next: string;

  constructor(private dishservice: DishService,
    private location: Location,
    private routes: ActivatedRoute) { }

  ngOnInit(): void { 
    this.dishservice.getDishIds()
      .subscribe(dishIds => this.dishIds = dishIds )

    this.routes.params
       .pipe(switchMap((params:Params) => this.dishservice.getDish(params['id'])))
       .subscribe(dish =>  {this.dish = dish; this.setPrevNext(dish.id)});
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId)
    this.prev = this.dishIds[(this.dishIds.length + index-1 ) % this.dishIds.length]
    this.next = this.dishIds[(this.dishIds.length + index+1 ) % this.dishIds.length]
  }

  goBack(): void {
    this.location.back();
  }

}
