import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { AngularFireAuthModule, AngularFireAuth } from  'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  user: firebase.User;
  userType: string;

  constructor(private authService: AuthService, private router: Router, private afAuth: AngularFireAuth, private db: AngularFirestore) {
     this.afAuth.authState.subscribe(user => {
        this.user = user;
        if (user && user != null) {
        this.getUserType(user.uid);
         }});
   }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
        this.user = user;
        if (user && user != null) {
          this.getUserType(user.uid);
          }});

  }

  refreshUser() {
         this.afAuth.authState.subscribe(user => {
        this.user = user;
        if (user && user != null) {
        this.getUserType(user.uid);
         }});
  }


  onLogin() {
    this.authService.login();
    console.log('navigating');
    this.router.navigate(['/login']);
  }

  onLogout() {
    this.afAuth.auth.signOut();
    this.authService.logout();
  }

  getUserType(id) {
   // var id = this.authService.getLoggedUserId();
    if (id) {
      var docRef = this.db.firestore.collection("users").doc(id);
      var userType: string = '';

      docRef.get().then((doc) =>
        {   if (doc.exists) {
            userType = doc.data().userType;
            this.userType = userType;

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }

  }

}
