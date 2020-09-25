import { Component, OnInit} from '@angular/core';
import { Dish } from '../shared/dish'
import { Params, ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'
import { DishService } from '../services/dish.service'

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  
 
  dish: Dish;

  constructor(private DishService: DishService,
    private location: Location,
    private routes: ActivatedRoute) { }

  ngOnInit(): void { 
    let id = this.routes.snapshot.params['id'];
     this.DishService.getDish(id)
    .then(dish =>  this.dish = dish);
  }

  goBack(): void {
    this.location.back();
  }

}
