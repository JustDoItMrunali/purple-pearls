import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductList } from "../../products/product-list/product-list";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, ProductList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
