import { Component, OnInit} from '@angular/core';
import { Dish } from '../shared/dish'
import { Params, ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'
import { DishService } from '../services/dish.service'
import { switchMap} from 'rxjs/operators'
import { Comment } from '../shared/comment'

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  
  leaveComment: FormGroup;
  comment: Comment;
 


  dish: Dish;
  dishIds : string[];
  prev: string;
  next: string;


  formErrors = {
    'author':'',
    'comment':'',
    
  }

  validationMessages = {
    'author': {
      'required': 'Author is required'
    },
    'comment': {
      'required': 'Comment is required'
    }
  }

  constructor(private dishservice: DishService,
    private location: Location,
    private routes: ActivatedRoute,
    private fb: FormBuilder) { 
      this.createForm()
    }

    onSubmit() {
     
      this.comment = this.leaveComment.value;
      console.log(this.comment);
      this.leaveComment.reset({
        author: '',
        comment: '',
        date: '',
        rating: 5
      })
    
    }


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

  createForm() {
    this.leaveComment = this.fb.group ({
      author: ['', [Validators.required]],
      comment: ['', [Validators.required]],
      rating: 5,
      date: new Date(),
    })

    this.leaveComment.valueChanges
      .subscribe(data => this.onValueChanged(data))
    
    this.onValueChanged()
  }

  onValueChanged(data?: any) {
    if(!this.leaveComment) {
      return;
    }
    const form= this.leaveComment;
    for(const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)){
        this.formErrors[field] ='';
        const control = form.get(field);
        if (control && control.dirty &&!control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        } 
      }
    }
  }

 
 

  };
 

