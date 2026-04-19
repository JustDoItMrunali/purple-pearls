import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductList } from "../../products/product-list/product-list";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, ProductList, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
