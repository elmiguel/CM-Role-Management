import { Component, Input, OnInit, Renderer2, ElementRef } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
  user: any
  title = 'app works!'
  private nativeElement: any
  route: any

  constructor(private renderer: Renderer2, private element: ElementRef) {
    /*
      Renderer2 could be used to re-render the App root to remove the injected data
    */
    this.nativeElement = element.nativeElement
  }

  ngOnInit() {
    // this.route = this.nativeElement.getAttribute('route')
    // this.user = JSON.parse(this.nativeElement.getAttribute('user')) || {}
    // this.renderer.removeAttribute(this.nativeElement, "user")
    // this.renderer.removeAttribute(this.nativeElement, "route")
    // console.log(this.user)
    // console.log(this.route)
  }
}
