import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalRoutingModule } from './personal-routing.module';
import { FavoriteComponent } from './favorite/favorite.component';
import { InfoComponent } from './info/info.component';
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import { OrdersComponent } from './orders/orders.component';


@NgModule({
  declarations: [
    FavoriteComponent,
    InfoComponent,
    OrdersComponent,
  ],
  imports: [
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    PersonalRoutingModule
  ]
})
export class PersonalModule { }
