import { Card } from "primeng/card";
import { Button } from "primeng/button";
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from "primeng/inputtext";
import { RouterModule } from "@angular/router";
import { FloatLabel } from "primeng/floatlabel";

@Component({
  selector: 'app-register.component',
  templateUrl: './register.component.html',
  imports: [RouterModule, Card, Button, FloatLabel, InputText, FormsModule],
})

export class RegisterComponent {

}
