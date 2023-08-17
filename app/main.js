"use strict";
(self["webpackChunkdip_webserver"] = self["webpackChunkdip_webserver"] || []).push([["main"],{

/***/ 3966:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppRoutingModule: () => (/* binding */ AppRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 7947);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);



const routes = [];
class AppRoutingModule {}
AppRoutingModule.ɵfac = function AppRoutingModule_Factory(t) {
  return new (t || AppRoutingModule)();
};
AppRoutingModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
  type: AppRoutingModule
});
AppRoutingModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
  imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule.forRoot(routes), _angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule]
});
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AppRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule]
  });
})();

/***/ }),

/***/ 6401:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppComponent: () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _core_services_websocket_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/services/websocket.service */ 9053);
/* harmony import */ var _core_services_utils_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/services/utils.service */ 9881);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/progress-bar */ 8173);
/* harmony import */ var _components_toolbar_toolbar_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/toolbar/toolbar.component */ 5512);
/* harmony import */ var _components_logs_logs_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/logs/logs.component */ 3487);
/* harmony import */ var _components_steps_steps_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/steps/steps.component */ 5770);
/* harmony import */ var _components_view_view_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/view/view.component */ 4268);









function AppComponent_mat_progress_bar_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](0, "mat-progress-bar", 11);
  }
}
class AppComponent {
  isTestInProgress() {
    return this.isTestStarted && !this.isTestStoped;
  }
  constructor(websocketService, utilsService) {
    this.websocketService = websocketService;
    this.utilsService = utilsService;
    this.isTestsLoading = false;
    this.isTestStarted = false;
    this.isTestStoped = false;
    this.tests = [];
    this.logFileContent = '';
    this.statusFileContent = '';
  }
  ngOnInit() {
    // this.getTests();
    this.listenWebsocketConnection();
  }
  listenWebsocketConnection() {
    this.isTestsLoading = true;
    this.subscription = this.websocketService.listen().subscribe({
      next: socketData => {
        console.log('listen websocket', socketData);
        this.isTestsLoading = false;
        this.distributeDatas(socketData);
      },
      error: err => {
        console.error('ERROR - listen websocket', err);
        this.utilsService.showSnackMessage('ERROR - listen websocket : ' + err, 'OK');
      },
      complete: () => {
        console.log('listen websocket complete');
        this.isTestsLoading = false;
      }
    });
  }
  onSelectChange(test) {
    this.selectedTest = test;
  }
  onStartTest(test) {
    console.log('start Test', test);
  }
  onStopTest(test) {
    console.log('stop test', test);
  }
  distributeDatas(socketData) {
    switch (socketData.type) {
      case 'join':
        this.joinConnection(socketData);
        break;
      case 'message':
        this.receiveMessage(socketData);
        break;
      case 'startTest':
        this.testStarted(socketData);
        break;
      case 'stopTest':
        this.testStoped(socketData);
        break;
      case 'readLogFile':
        this.readLogFile(socketData);
        break;
      case 'readStatusFile':
        this.readStatusFile(socketData);
        break;
      default:
        console.error('unknown type', socketData.type);
        this.utilsService.showSnackMessage('unknown type comming from websocket: ' + socketData.type, 'OK');
        break;
    }
  }
  joinConnection(socketData) {
    console.log('joinConnection');
    if (!socketData.data || socketData.data.connected !== true) {
      this.utilsService.showSnackMessage('connection with websocket cannot be established', 'OK');
      return;
    }
    if (!socketData.data.tests) {
      this.utilsService.showSnackMessage('no tests found', 'OK');
      return;
    }
    this.utilsService.showSnackMessage('connection with websocket established', 'OK', 5);
    this.tests = socketData.data.tests;
  }
  receiveMessage(socketData) {
    console.log('receiveMessage', socketData);
    if (!socketData.data.message) {
      console.error('no message found in socketData', socketData);
      this.utilsService.showSnackMessage('no message found in socketData', 'OK');
      return;
    }
    this.utilsService.showSnackMessage(socketData.data.message, 'OK');
  }
  testStarted(socketData) {
    console.log('testStarted', socketData);
    this.isTestStarted = true;
    this.isTestStoped = false;
  }
  testStoped(socketData) {
    console.log('testStoped', socketData);
    this.isTestStarted = false;
    this.isTestStoped = true;
  }
  readLogFile(socketData) {
    console.log('readLogFile', socketData);
    this.logFileContent = socketData.data;
  }
  readStatusFile(socketData) {
    console.log('readStatusFile', socketData);
    this.statusFileContent = JSON.parse(socketData.data);
  }
}
AppComponent.ɵfac = function AppComponent_Factory(t) {
  return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_core_services_websocket_service__WEBPACK_IMPORTED_MODULE_0__.WebsocketService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_core_services_utils_service__WEBPACK_IMPORTED_MODULE_1__.UtilsService));
};
AppComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
  type: AppComponent,
  selectors: [["app-root"]],
  decls: 12,
  vars: 10,
  consts: [[1, "layout"], [1, "header"], [3, "tests", "isLoading", "isTestStarted", "isTestStoped", "selectChange", "startTest", "stopTest"], ["mode", "indeterminate", 4, "ngIf"], [1, "main"], [1, "content"], [1, "content-top"], [3, "test"], [1, "content-bottom"], [3, "test", "fileContent"], [1, "sidebar"], ["mode", "indeterminate"]],
  template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "app-toolbar", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("selectChange", function AppComponent_Template_app_toolbar_selectChange_2_listener($event) {
        return ctx.onSelectChange($event);
      })("startTest", function AppComponent_Template_app_toolbar_startTest_2_listener($event) {
        return ctx.onStartTest($event);
      })("stopTest", function AppComponent_Template_app_toolbar_stopTest_2_listener($event) {
        return ctx.onStopTest($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](3, AppComponent_mat_progress_bar_3_Template, 1, 0, "mat-progress-bar", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "div", 4)(5, "div", 5)(6, "div", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](7, "app-view", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "div", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](9, "app-logs", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](10, "div", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](11, "app-steps", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("tests", ctx.tests)("isLoading", ctx.isTestsLoading)("isTestStarted", ctx.isTestStarted)("isTestStoped", ctx.isTestStoped);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx.isTestInProgress());
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("test", ctx.selectedTest);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("test", ctx.selectedTest)("fileContent", ctx.logFileContent);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("test", ctx.selectedTest)("fileContent", ctx.statusFileContent);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.NgIf, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_8__.MatProgressBar, _components_toolbar_toolbar_component__WEBPACK_IMPORTED_MODULE_2__.ToolbarComponent, _components_logs_logs_component__WEBPACK_IMPORTED_MODULE_3__.LogsComponent, _components_steps_steps_component__WEBPACK_IMPORTED_MODULE_4__.StepsComponent, _components_view_view_component__WEBPACK_IMPORTED_MODULE_5__.ViewComponent],
  styles: [".layout[_ngcontent-%COMP%] {\n  width: 100vw;\n  height: 100vh;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n\n.main[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: row;\n  height: 100%;\n  overflow: hidden;\n}\n.main[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%] {\n  flex: 2;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.main[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .content-top[_ngcontent-%COMP%], .main[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .content-bottom[_ngcontent-%COMP%] {\n  flex: 1;\n  overflow: auto;\n}\n.main[_ngcontent-%COMP%]   .sidebar[_ngcontent-%COMP%] {\n  flex: 1;\n  height: 100%;\n  max-height: 100%;\n  overflow: auto;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0MsWUFBQTtFQUNBLGFBQUE7RUFDQSxnQkFBQTtFQUVBLGFBQUE7RUFDQSxzQkFBQTtBQUFEOztBQU1BO0VBQ0MsT0FBQTtFQUVBLGFBQUE7RUFDQSxtQkFBQTtFQUVBLFlBQUE7RUFDQSxnQkFBQTtBQUxEO0FBT0M7RUFDQyxPQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUVBLGdCQUFBO0FBTkY7QUFRRTtFQUNDLE9BQUE7RUFDQSxjQUFBO0FBTkg7QUFpQkM7RUFDQyxPQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtBQWZGIiwic291cmNlc0NvbnRlbnQiOlsiLmxheW91dCB7XG5cdHdpZHRoOiAxMDB2dztcblx0aGVpZ2h0OiAxMDB2aDtcblx0b3ZlcmZsb3c6IGhpZGRlbjtcblx0XG5cdGRpc3BsYXk6IGZsZXg7XG5cdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG59XG4gIFxuLmhlYWRlciB7IFxuXHQvLyBiYWNrZ3JvdW5kLWNvbG9yOiBhcXVhO1xufVxuLm1haW4ge1xuXHRmbGV4OiAxO1xuXG5cdGRpc3BsYXk6IGZsZXg7XG5cdGZsZXgtZGlyZWN0aW9uOiByb3c7XG5cblx0aGVpZ2h0OiAxMDAlO1xuXHRvdmVyZmxvdzogaGlkZGVuO1xuXG5cdC5jb250ZW50IHtcblx0XHRmbGV4OiAyO1xuXHRcdGhlaWdodDogMTAwJTtcblx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cblx0XHRvdmVyZmxvdzogaGlkZGVuO1xuXG5cdFx0LmNvbnRlbnQtdG9wLCAuY29udGVudC1ib3R0b217XG5cdFx0XHRmbGV4OiAxO1xuXHRcdFx0b3ZlcmZsb3c6IGF1dG87XG5cdFx0fVxuXG5cdFx0LmNvbnRlbnQtdG9we1xuXHRcdFx0Ly8gYmFja2dyb3VuZC1jb2xvcjogYmx1ZXZpb2xldDtcblx0XHR9XG5cdFx0LmNvbnRlbnQtYm90dG9te1xuXHRcdFx0Ly8gYmFja2dyb3VuZC1jb2xvcjogYnJvd247XG5cdFx0fVxuXHR9XG5cblx0LnNpZGViYXIge1xuXHRcdGZsZXg6IDE7XG5cdFx0aGVpZ2h0OiAxMDAlO1xuXHRcdG1heC1oZWlnaHQ6IDEwMCU7XG5cdFx0b3ZlcmZsb3c6IGF1dG87XG5cdH1cblxufVxuLmZvb3RlciB7XG5cdC8vIGJhY2tncm91bmQtY29sb3I6IGdyZWVuO1xufVxuICAiXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 8629:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppModule: () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common/http */ 4860);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/platform-browser */ 6480);
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/platform-browser/animations */ 4987);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/forms */ 8849);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app-routing.module */ 3966);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component */ 6401);
/* harmony import */ var _material_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./material.module */ 9099);
/* harmony import */ var _components_toolbar_toolbar_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/toolbar/toolbar.component */ 5512);
/* harmony import */ var _components_logs_logs_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/logs/logs.component */ 3487);
/* harmony import */ var _components_steps_steps_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/steps/steps.component */ 5770);
/* harmony import */ var _components_view_view_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/view/view.component */ 4268);
/* harmony import */ var _components_layout_layout_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/layout/layout.component */ 2952);
/* harmony import */ var _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/footer/footer.component */ 7913);
/* harmony import */ var _core_services_http_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./core/services/http.service */ 1732);
/* harmony import */ var _components_steps_step_status_step_status_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/steps/step-status/step-status.component */ 3690);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 1699);
















class AppModule {}
AppModule.ɵfac = function AppModule_Factory(t) {
  return new (t || AppModule)();
};
AppModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineNgModule"]({
  type: AppModule,
  bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent]
});
AppModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineInjector"]({
  providers: [_core_services_http_service__WEBPACK_IMPORTED_MODULE_9__.HttpService],
  imports: [_angular_common_http__WEBPACK_IMPORTED_MODULE_12__.HttpClientModule, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_13__.BrowserModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__.BrowserAnimationsModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _material_module__WEBPACK_IMPORTED_MODULE_2__.MaterialModule, _angular_forms__WEBPACK_IMPORTED_MODULE_15__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_15__.ReactiveFormsModule]
});
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵsetNgModuleScope"](AppModule, {
    declarations: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent, _components_layout_layout_component__WEBPACK_IMPORTED_MODULE_7__.LayoutComponent, _components_toolbar_toolbar_component__WEBPACK_IMPORTED_MODULE_3__.ToolbarComponent, _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_8__.FooterComponent, _components_logs_logs_component__WEBPACK_IMPORTED_MODULE_4__.LogsComponent, _components_steps_steps_component__WEBPACK_IMPORTED_MODULE_5__.StepsComponent, _components_view_view_component__WEBPACK_IMPORTED_MODULE_6__.ViewComponent, _components_steps_step_status_step_status_component__WEBPACK_IMPORTED_MODULE_10__.StepStatusComponent],
    imports: [_angular_common_http__WEBPACK_IMPORTED_MODULE_12__.HttpClientModule, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_13__.BrowserModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__.BrowserAnimationsModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _material_module__WEBPACK_IMPORTED_MODULE_2__.MaterialModule, _angular_forms__WEBPACK_IMPORTED_MODULE_15__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_15__.ReactiveFormsModule]
  });
})();

/***/ }),

/***/ 7913:
/*!*******************************************************!*\
  !*** ./src/app/components/footer/footer.component.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FooterComponent: () => (/* binding */ FooterComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/toolbar */ 2484);


class FooterComponent {}
FooterComponent.ɵfac = function FooterComponent_Factory(t) {
  return new (t || FooterComponent)();
};
FooterComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
  type: FooterComponent,
  selectors: [["app-footer"]],
  decls: 1,
  vars: 0,
  template: function FooterComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "mat-toolbar");
    }
  },
  dependencies: [_angular_material_toolbar__WEBPACK_IMPORTED_MODULE_1__.MatToolbar],
  styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 2952:
/*!*******************************************************!*\
  !*** ./src/app/components/layout/layout.component.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LayoutComponent: () => (/* binding */ LayoutComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/card */ 8497);




const _c0 = ["header"];
const _c1 = ["body"];
const _c2 = ["actions"];
const _c3 = ["footer"];
function LayoutComponent_mat_card_header_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-card-header", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](1, 0, ["#header", ""]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function LayoutComponent_mat_card_content_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-card-content", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](1, 1, ["#body", ""]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function LayoutComponent_mat_card_actions_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-card-actions", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](1, 2, ["#actions", ""]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("align", ctx_r2.actionAlign);
  }
}
function LayoutComponent_mat_card_footer_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-card-footer", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](1, 3, ["#footer", ""]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
const _c4 = [[["", 8, "header"]], [["", 8, "body"]], [["", 8, "actions"]], [["", 8, "footer"]]];
const _c5 = [".header", ".body", ".actions", ".footer"];
class LayoutComponent {
  constructor() {
    this.actionAlign = 'start';
  }
  hasHeader() {
    return !!this.headerContent;
  }
  hasBody() {
    return !!this.bodyContent;
  }
  hasActions() {
    return !!this.actionsContent;
  }
  hasFooter() {
    return !!this.footerContent;
  }
}
LayoutComponent.ɵfac = function LayoutComponent_Factory(t) {
  return new (t || LayoutComponent)();
};
LayoutComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
  type: LayoutComponent,
  selectors: [["app-layout"]],
  contentQueries: function LayoutComponent_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, _c0, 4, _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, _c1, 4, _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, _c2, 4, _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, _c3, 4, _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.headerContent = _t);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.bodyContent = _t);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.actionsContent = _t);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.footerContent = _t);
    }
  },
  inputs: {
    actionAlign: "actionAlign"
  },
  ngContentSelectors: _c5,
  decls: 5,
  vars: 4,
  consts: [[1, "layout-container"], ["class", "layout-header", 4, "ngIf"], ["class", "layout-content", 4, "ngIf"], [3, "align", 4, "ngIf"], ["class", "layout-footer", 4, "ngIf"], [1, "layout-header"], [1, "layout-content"], [3, "align"], [1, "layout-footer"]],
  template: function LayoutComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"](_c4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-card", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, LayoutComponent_mat_card_header_1_Template, 2, 0, "mat-card-header", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, LayoutComponent_mat_card_content_2_Template, 2, 0, "mat-card-content", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, LayoutComponent_mat_card_actions_3_Template, 2, 1, "mat-card-actions", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, LayoutComponent_mat_card_footer_4_Template, 2, 0, "mat-card-footer", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.hasHeader());
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.hasBody());
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.hasActions());
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.hasFooter());
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCard, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardActions, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardContent, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardFooter, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardHeader],
  styles: [".layout-container[_ngcontent-%COMP%] {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n}\n.layout-container[_ngcontent-%COMP%]   .layout-content[_ngcontent-%COMP%] {\n  flex-grow: 1;\n  height: 100%;\n  overflow: auto;\n  margin: 0;\n  padding: 0;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0MsWUFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtBQUNEO0FBS0M7RUFDQyxZQUFBO0VBQ0EsWUFBQTtFQUNBLGNBQUE7RUFDQSxTQUFBO0VBQ0EsVUFBQTtBQUhGIiwic291cmNlc0NvbnRlbnQiOlsiLmxheW91dC1jb250YWluZXJ7XG5cdGhlaWdodDogMTAwJTtcblx0ZGlzcGxheTogZmxleDtcblx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblxuXHQvLyAubGF5b3V0LWhlYWRlcntcblxuXHQvLyB9XG5cblx0LmxheW91dC1jb250ZW50e1xuXHRcdGZsZXgtZ3JvdzogMTtcblx0XHRoZWlnaHQ6IDEwMCU7XG5cdFx0b3ZlcmZsb3c6IGF1dG87XG5cdFx0bWFyZ2luOiAwO1xuXHRcdHBhZGRpbmc6IDA7XG5cdH1cblxuXHQvLyAubGF5b3V0LWZvb3RlcntcblxuXHQvLyB9XG59Il0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 3487:
/*!***************************************************!*\
  !*** ./src/app/components/logs/logs.component.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LogsComponent: () => (/* binding */ LogsComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var src_app_core_services_websocket_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/websocket.service */ 9053);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/button */ 895);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/progress-spinner */ 3910);
/* harmony import */ var _layout_layout_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../layout/layout.component */ 2952);






function LogsComponent_span_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("for \"", ctx_r0.test.label, "\"");
  }
}
function LogsComponent_small_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" (", ctx_r1.test == null ? null : ctx_r1.test.logFile, ")");
  }
}
function LogsComponent_mat_spinner_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "mat-spinner", 7);
  }
}
class LogsComponent {
  constructor(websocketService) {
    this.websocketService = websocketService;
    this.isLoading = false;
    this.fileContent = '';
  }
  ngOnInit() {}
  ngOnChanges(changes) {
    console.log('[logs] ngOnChanges', changes);
    if (changes.test && changes.test.currentValue !== changes.test.previousValue) {
      this.askForLogFileContent(changes.test.currentValue);
    }
  }
  askForLogFileContent(test) {
    console.log('askForLogFileContent', test);
    this.websocketService.sendMessage({
      sender: 'client',
      type: 'askLogFile',
      data: test
    });
  }
  clearLog() {
    this.fileContent = '';
  }
}
LogsComponent.ɵfac = function LogsComponent_Factory(t) {
  return new (t || LogsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](src_app_core_services_websocket_service__WEBPACK_IMPORTED_MODULE_0__.WebsocketService));
};
LogsComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: LogsComponent,
  selectors: [["app-logs"]],
  inputs: {
    test: "test",
    fileContent: "fileContent"
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵNgOnChangesFeature"]],
  decls: 13,
  vars: 5,
  consts: [["actionAlign", "start"], [1, "header"], [4, "ngIf"], ["class", "mat-spinner", 4, "ngIf"], [1, "body"], [1, "actions"], ["mat-button", "", "color", "primary", 3, "disabled", "click"], [1, "mat-spinner"]],
  template: function LogsComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "app-layout", 0)(1, "div", 1)(2, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, " Logs ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, LogsComponent_span_4_Template, 2, 1, "span", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](5, LogsComponent_small_5_Template, 2, 1, "small", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](6, LogsComponent_mat_spinner_6_Template, 1, 0, "mat-spinner", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "div", 4)(8, "pre");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "div", 5)(11, "button", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function LogsComponent_Template_button_click_11_listener() {
        return ctx.clearLog();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](12, "Clear");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.test);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.test == null ? null : ctx.test.logFile);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isLoading);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx.fileContent, " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.isLoading);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButton, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_5__.MatProgressSpinner, _layout_layout_component__WEBPACK_IMPORTED_MODULE_1__.LayoutComponent],
  styles: ["mat-spinner[_ngcontent-%COMP%] {\n  width: 30px !important;\n  height: 30px !important;\n  margin: 0 20px;\n}\n\n.header[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-start;\n  align-items: center;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY29tcG9uZW50cy9sb2dzL2xvZ3MuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDQyxzQkFBQTtFQUNBLHVCQUFBO0VBQ0EsY0FBQTtBQUNEOztBQUVBO0VBQ0MsV0FBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLDJCQUFBO0VBQ0EsbUJBQUE7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIm1hdC1zcGlubmVye1xuXHR3aWR0aDogMzBweCAhaW1wb3J0YW50O1xuXHRoZWlnaHQ6IDMwcHggIWltcG9ydGFudDtcblx0bWFyZ2luOiAwIDIwcHg7XG59XG5cbi5oZWFkZXJ7XG5cdHdpZHRoOiAxMDAlO1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRmbGV4LWRpcmVjdGlvbjogcm93O1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59Il0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 3690:
/*!***********************************************************************!*\
  !*** ./src/app/components/steps/step-status/step-status.component.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StepStatusComponent: () => (/* binding */ StepStatusComponent)
/* harmony export */ });
/* harmony import */ var src_app_core_interfaces__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/interfaces */ 5481);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);


const _c0 = ["*"];
class StepStatusComponent {
  constructor() {}
  getNodeStatus() {
    if (!this.status) {
      return src_app_core_interfaces__WEBPACK_IMPORTED_MODULE_0__.CommandStatus.UNDEFINED;
    }
    if (typeof this.status === 'string') {
      return this.status;
    } else if (typeof this.status === 'number') {
      if (this.status < 0) {
        return src_app_core_interfaces__WEBPACK_IMPORTED_MODULE_0__.CommandStatus.STOPED;
      } else if (this.status > 0) {
        return src_app_core_interfaces__WEBPACK_IMPORTED_MODULE_0__.CommandStatus.STARTED;
      } else if (this.status === 0) {
        return src_app_core_interfaces__WEBPACK_IMPORTED_MODULE_0__.CommandStatus.PAUSED;
      } else {
        return src_app_core_interfaces__WEBPACK_IMPORTED_MODULE_0__.CommandStatus.STOPED;
      }
    } else {
      return src_app_core_interfaces__WEBPACK_IMPORTED_MODULE_0__.CommandStatus.UNDEFINED;
    }
  }
}
StepStatusComponent.ɵfac = function StepStatusComponent_Factory(t) {
  return new (t || StepStatusComponent)();
};
StepStatusComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
  type: StepStatusComponent,
  selectors: [["app-step-status"]],
  inputs: {
    status: "status"
  },
  ngContentSelectors: _c0,
  decls: 4,
  vars: 1,
  consts: [[1, "nodeStatus"]],
  template: function StepStatusComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵprojectionDef"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵprojection"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.getNodeStatus());
    }
  },
  styles: [".nodeStatus[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n  margin-left: 10px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY29tcG9uZW50cy9zdGVwcy9zdGVwLXN0YXR1cy9zdGVwLXN0YXR1cy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNDLFdBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSw4QkFBQTtFQUNBLG1CQUFBO0VBRUEsaUJBQUE7QUFBRCIsInNvdXJjZXNDb250ZW50IjpbIi5ub2RlU3RhdHVze1xuXHR3aWR0aDogMTAwJTtcblx0ZGlzcGxheTogZmxleDtcblx0ZmxleC1kaXJlY3Rpb246IHJvdztcblx0anVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuXHRhbGlnbi1pdGVtczogY2VudGVyO1xuXG5cdG1hcmdpbi1sZWZ0OiAxMHB4O1xufSJdLCJzb3VyY2VSb290IjoiIn0= */"]
});

/***/ }),

/***/ 5770:
/*!*****************************************************!*\
  !*** ./src/app/components/steps/steps.component.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StepsComponent: () => (/* binding */ StepsComponent)
/* harmony export */ });
/* harmony import */ var _angular_cdk_tree__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/cdk/tree */ 6747);
/* harmony import */ var _angular_material_tree__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/tree */ 7321);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var src_app_core_services_websocket_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/websocket.service */ 9053);
/* harmony import */ var src_app_core_services_utils_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/core/services/utils.service */ 9881);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/button */ 895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/icon */ 6515);
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/progress-bar */ 8173);
/* harmony import */ var _layout_layout_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../layout/layout.component */ 2952);
/* harmony import */ var _step_status_step_status_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./step-status/step-status.component */ 3690);












function StepsComponent_mat_tree_node_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "mat-tree-node", 11)(1, "app-step-status", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const childNode_r4 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("status", childNode_r4.status);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](childNode_r4.name);
  }
}
function StepsComponent_mat_nested_tree_node_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "mat-nested-tree-node")(1, "div", 13)(2, "button", 14)(3, "mat-icon", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "app-step-status", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainer"](8, 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const parentNode_r5 = ctx.$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵattribute"]("aria-label", "Toggle " + parentNode_r5.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r2.treeControl.isExpanded(parentNode_r5) ? "expand_more" : "chevron_right", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("status", parentNode_r5.status);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](parentNode_r5.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("tree-invisible", !ctx_r2.treeControl.isExpanded(parentNode_r5));
  }
}
function StepsComponent_mat_progress_bar_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "mat-progress-bar", 18);
  }
}
class StepsComponent {
  // protected steps: Step[] = [];
  constructor(websocketService, utilsService) {
    this.websocketService = websocketService;
    this.utilsService = utilsService;
    this.treeControl = new _angular_cdk_tree__WEBPACK_IMPORTED_MODULE_5__.NestedTreeControl(node => node.children);
    this.dataSource = new _angular_material_tree__WEBPACK_IMPORTED_MODULE_6__.MatTreeNestedDataSource();
    // commandStatus: CommandStatus = CommandStatus.STOPED;
    this.isLoading = false;
    this.fileContent = '';
    // MAT TREE
    this.hasChild = (_, node) => !!node.children && node.children.length > 0;
  }
  ngOnInit() {}
  ngOnChanges(changes) {
    console.log('[steps] ngOnChanges', changes);
    if (changes.test && changes.test.currentValue !== changes.test.previousValue) {
      this.askForStatusFileContent(changes.test.currentValue);
    }
    if (changes.fileContent && changes.fileContent.currentValue && changes.fileContent.currentValue !== changes.fileContent.previousValue) {
      console.log('fileContent', changes.fileContent.currentValue);
      this.detectAndFormatSteps(changes.fileContent.currentValue);
    }
  }
  askForStatusFileContent(test) {
    console.log('askForStatusFileContent', test);
    this.websocketService.sendMessage({
      sender: 'client',
      type: 'askStatusFile',
      data: test
    });
  }
  clearStatus() {
    this.fileContent = '';
  }
  detectAndFormatSteps(data) {
    const formatedStatus = this.formatStepStatus(data);
    console.log('formatedStatus', formatedStatus);
    if (!formatedStatus) {
      this.utilsService.showSnackMessage('ERROR - detectAndFormatSteps : wrong file format', 'OK');
      return;
    }
    this.formatedStatus = formatedStatus;
    this.updateTree();
  }
  formatStepStatus(data) {
    console.log('formatStepStatus', data);
    return data;
  }
  // protected getNodeStatus(status: number): CommandStatus {
  // 	console.log('getNodeStatus', status);
  // 	if(status < 0){
  // 		return CommandStatus.STOPED;
  // 	}else if(status > 0){
  // 		return CommandStatus.STARTED;
  // 	}else if(status === 0){
  // 		return CommandStatus.PAUSED;
  // 	}else{
  // 		return CommandStatus.STOPED;
  // 	}
  // }
  updateTree() {
    this.isLoading = true;
    this.dataSource.data = [];
    if (!this.formatedStatus) {
      console.warn('formatedStatus is undefined');
      this.isLoading = false;
      return;
    }
    const nodes = this._transformer(this.formatedStatus);
    if (nodes && nodes.length > 0) this.dataSource.data = nodes;
    this.isLoading = false;
  }
  _transformer(testStatus) {
    if (!testStatus) {
      console.warn('test is undefined');
      return;
    }
    if (!testStatus.steps) {
      console.warn('test.steps is undefined');
      return;
    }
    let steps = [];
    testStatus.steps.forEach(step => {
      const commands = [];
      step.values.forEach(command => {
        commands.push({
          name: command.id,
          level: 2,
          status: command.status ? command.status : 0
        });
      });
      steps.push({
        name: step.key,
        level: 1,
        status: step.status ? step.status : 0,
        children: commands
      });
    });
    return steps;
  }
}
StepsComponent.ɵfac = function StepsComponent_Factory(t) {
  return new (t || StepsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_core_services_websocket_service__WEBPACK_IMPORTED_MODULE_0__.WebsocketService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_core_services_utils_service__WEBPACK_IMPORTED_MODULE_1__.UtilsService));
};
StepsComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
  type: StepsComponent,
  selectors: [["app-steps"]],
  inputs: {
    test: "test",
    fileContent: "fileContent"
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵNgOnChangesFeature"]],
  decls: 14,
  vars: 4,
  consts: [["actionAlign", "end"], [1, "header"], [1, "body"], [1, "tree", 3, "dataSource", "treeControl"], ["mytree", ""], ["matTreeNodeToggle", "", 4, "matTreeNodeDef"], [4, "matTreeNodeDef", "matTreeNodeDefWhen"], [1, "actions"], ["mat-button", "", 3, "click"], [1, "footer"], ["mode", "indeterminate", 4, "ngIf"], ["matTreeNodeToggle", ""], [3, "status"], [1, "mat-tree-node"], ["mat-icon-button", "", "matTreeNodeToggle", ""], [1, "mat-icon-rtl-mirror"], ["role", "group"], ["matTreeNodeOutlet", ""], ["mode", "indeterminate"]],
  template: function StepsComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "app-layout", 0)(1, "div", 1)(2, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, "Steps");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "div", 2)(5, "mat-tree", 3, 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](7, StepsComponent_mat_tree_node_7_Template, 3, 2, "mat-tree-node", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](8, StepsComponent_mat_nested_tree_node_8_Template, 9, 6, "mat-nested-tree-node", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "div", 7)(10, "button", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function StepsComponent_Template_button_click_10_listener() {
        return ctx.clearStatus();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](11, "Clear");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "div", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](13, StepsComponent_mat_progress_bar_13_Template, 1, 0, "mat-progress-bar", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("dataSource", ctx.dataSource)("treeControl", ctx.treeControl);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matTreeNodeDefWhen", ctx.hasChild);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.isLoading);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.NgIf, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__.MatIcon, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_10__.MatProgressBar, _angular_material_tree__WEBPACK_IMPORTED_MODULE_6__.MatNestedTreeNode, _angular_material_tree__WEBPACK_IMPORTED_MODULE_6__.MatTreeNodeDef, _angular_material_tree__WEBPACK_IMPORTED_MODULE_6__.MatTreeNodeToggle, _angular_material_tree__WEBPACK_IMPORTED_MODULE_6__.MatTree, _angular_material_tree__WEBPACK_IMPORTED_MODULE_6__.MatTreeNode, _angular_material_tree__WEBPACK_IMPORTED_MODULE_6__.MatTreeNodeOutlet, _layout_layout_component__WEBPACK_IMPORTED_MODULE_2__.LayoutComponent, _step_status_step_status_component__WEBPACK_IMPORTED_MODULE_3__.StepStatusComponent],
  styles: [".tree-invisible[_ngcontent-%COMP%] {\n  display: none;\n}\n\n.tree[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%], .tree[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin-top: 0;\n  margin-bottom: 0;\n  list-style-type: none;\n}\n\n\n\n.tree[_ngcontent-%COMP%]   .mat-nested-tree-node[_ngcontent-%COMP%]   div[role=group][_ngcontent-%COMP%] {\n  padding-left: 40px;\n}\n\n.tree[_ngcontent-%COMP%]   div[role=group][_ngcontent-%COMP%]    > .mat-tree-node[_ngcontent-%COMP%] {\n  padding-left: 40px;\n}\n\n.mat-tree[_ngcontent-%COMP%] {\n  background: transparent;\n}\n\n.mat-tree-node[_ngcontent-%COMP%] {\n  color: black;\n}\n\n.node-label[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 500;\n  color: #000000;\n  margin-left: 10px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY29tcG9uZW50cy9zdGVwcy9zdGVwcy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNDLGFBQUE7QUFDRDs7QUFFQTs7RUFFQyxhQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQkFBQTtBQUNEOztBQUVBLHFEQUFBO0FBQ0E7RUFDQyxrQkFBQTtBQUNEOztBQUVBO0VBQ0Msa0JBQUE7QUFDRDs7QUFFQTtFQUNDLHVCQUFBO0FBQ0Q7O0FBRUE7RUFDQyxZQUFBO0FBQ0Q7O0FBRUE7RUFDQyxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0VBQ0EsaUJBQUE7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi50cmVlLWludmlzaWJsZSB7XG5cdGRpc3BsYXk6IG5vbmU7XG59XG5cbi50cmVlIHVsLFxuLnRyZWUgbGkge1xuXHRtYXJnaW4tdG9wOiAwO1xuXHRtYXJnaW4tYm90dG9tOiAwO1xuXHRsaXN0LXN0eWxlLXR5cGU6IG5vbmU7XG59XG5cbi8qIFRoaXMgcGFkZGluZyBzZXRzIGFsaWdubWVudCBvZiB0aGUgbmVzdGVkIG5vZGVzLiAqL1xuLnRyZWUgLm1hdC1uZXN0ZWQtdHJlZS1ub2RlIGRpdltyb2xlPVwiZ3JvdXBcIl0ge1xuXHRwYWRkaW5nLWxlZnQ6IDQwcHg7XG59XG5cbi50cmVlIGRpdltyb2xlPVwiZ3JvdXBcIl0gPiAubWF0LXRyZWUtbm9kZSB7XG5cdHBhZGRpbmctbGVmdDogNDBweDtcbn1cblx0XG4ubWF0LXRyZWUge1xuXHRiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbn1cblx0XG4ubWF0LXRyZWUtbm9kZSB7XG5cdGNvbG9yOiBibGFjaztcbn1cblxuLm5vZGUtbGFiZWx7XG5cdGZvbnQtc2l6ZTogMTRweDtcblx0Zm9udC13ZWlnaHQ6IDUwMDtcblx0Y29sb3I6ICMwMDAwMDA7XG5cdG1hcmdpbi1sZWZ0OiAxMHB4O1xufSJdLCJzb3VyY2VSb290IjoiIn0= */"]
});

/***/ }),

/***/ 5512:
/*!*********************************************************!*\
  !*** ./src/app/components/toolbar/toolbar.component.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ToolbarComponent: () => (/* binding */ ToolbarComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var src_app_environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/environments/environment */ 1594);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 8849);
/* harmony import */ var src_app_core_services_http_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/core/services/http.service */ 1732);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/toolbar */ 2484);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/button */ 895);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/form-field */ 1333);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/select */ 6355);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/core */ 5309);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/progress-spinner */ 3910);












function ToolbarComponent_mat_spinner_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "mat-spinner", 4);
  }
}
function ToolbarComponent_div_5_mat_option_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mat-option", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const test_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("value", test_r6.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", test_r6.label, " ");
  }
}
function ToolbarComponent_div_5_button_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "button", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function ToolbarComponent_div_5_button_7_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r8);
      const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r7.OnStartTest());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Start ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function ToolbarComponent_div_5_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function ToolbarComponent_div_5_button_8_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r10);
      const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r9.OnStopTest());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Stop ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function ToolbarComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 5, 6)(2, "mat-form-field", 7)(3, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "Test");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "mat-select", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](6, ToolbarComponent_div_5_mat_option_6_Template, 2, 2, "mat-option", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](7, ToolbarComponent_div_5_button_7_Template, 2, 0, "button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](8, ToolbarComponent_div_5_button_8_Template, 2, 0, "button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formGroup", ctx_r1.headerForm);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r1.tests);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.selectedTest && !ctx_r1.isTestStarted);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.selectedTest && ctx_r1.isTestStarted);
  }
}
class ToolbarComponent {
  constructor(formBuilder, httpService) {
    this.formBuilder = formBuilder;
    this.httpService = httpService;
    this.appName = src_app_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.appName;
    this.isLoading = false;
    this.isTestStarted = false;
    this.isTestStoped = false;
    this.tests = [];
    this.selectChange = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.startTest = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.stopTest = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.socketConnections = 0;
    this.testCtrl = this.formBuilder.control('');
    this.headerForm = this.formBuilder.group({
      test: this.testCtrl
    });
    this.testCtrl.valueChanges.subscribe(value => {
      const test = this.tests?.find(test => test.id === value);
      if (test) {
        this.selectedTest = test;
        this.selectChange.emit(test);
      } else {
        console.warn('Test not found');
      }
    });
  }
  ngOnInit() {
    if (this.tests && this.tests.length <= 0) {
      console.warn('No tests to show');
    }
  }
  OnStartTest() {
    this.startTest.emit(this.selectedTest);
  }
  OnStopTest() {
    this.stopTest.emit(this.selectedTest);
  }
}
ToolbarComponent.ɵfac = function ToolbarComponent_Factory(t) {
  return new (t || ToolbarComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](src_app_core_services_http_service__WEBPACK_IMPORTED_MODULE_1__.HttpService));
};
ToolbarComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: ToolbarComponent,
  selectors: [["app-toolbar"]],
  inputs: {
    isLoading: "isLoading",
    isTestStarted: "isTestStarted",
    isTestStoped: "isTestStoped",
    tests: "tests"
  },
  outputs: {
    selectChange: "selectChange",
    startTest: "startTest",
    stopTest: "stopTest"
  },
  decls: 6,
  vars: 3,
  consts: [[1, "title"], [1, "spacer"], ["class", "mat-spinner", 4, "ngIf"], [3, "formGroup", 4, "ngIf"], [1, "mat-spinner"], [3, "formGroup"], ["formDirective", "ngForm"], ["hintLabel", "Used to select a test to execute"], ["formControlName", "test", 1, "col"], [3, "value", 4, "ngFor", "ngForOf"], ["mat-flat-button", "", "color", "primary", 3, "click", 4, "ngIf"], ["mat-flat-button", "", "color", "warn", 3, "click", 4, "ngIf"], [3, "value"], ["mat-flat-button", "", "color", "primary", 3, "click"], ["mat-flat-button", "", "color", "warn", 3, "click"]],
  template: function ToolbarComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mat-toolbar")(1, "span", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "span", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, ToolbarComponent_mat_spinner_4_Template, 1, 0, "mat-spinner", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](5, ToolbarComponent_div_5_Template, 9, 4, "div", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx.appName);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isLoading);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.isLoading && ctx.tests && ctx.tests.length > 0);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_5__.MatToolbar, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButton, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__.MatLabel, _angular_material_select__WEBPACK_IMPORTED_MODULE_8__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_9__.MatOption, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_10__.MatProgressSpinner, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControlName],
  styles: [".title[_ngcontent-%COMP%] {\n  font-size: 1.2em;\n  font-weight: 500;\n  margin: 0.5em 0;\n}\n\n.spacer[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n}\n\nmat-toolbar[_ngcontent-%COMP%] {\n  height: -moz-fit-content;\n  height: fit-content;\n  width: 100%;\n}\n\nmat-spinner[_ngcontent-%COMP%] {\n  width: 30px !important;\n  height: 30px !important;\n}\n\nbutton[_ngcontent-%COMP%] {\n  margin: 0 0.5em;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY29tcG9uZW50cy90b29sYmFyL3Rvb2xiYXIuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDQyxnQkFBQTtFQUNFLGdCQUFBO0VBQ0EsZUFBQTtBQUNIOztBQUVBO0VBQ0MsY0FBQTtBQUNEOztBQUVBO0VBQ0Msd0JBQUE7RUFBQSxtQkFBQTtFQUNBLFdBQUE7QUFDRDs7QUFDQTtFQUNDLHNCQUFBO0VBQ0EsdUJBQUE7QUFFRDs7QUFDQTtFQUNDLGVBQUE7QUFFRCIsInNvdXJjZXNDb250ZW50IjpbIi50aXRsZXtcblx0Zm9udC1zaXplOiAxLjJlbTtcbiAgXHRmb250LXdlaWdodDogNTAwO1xuICBcdG1hcmdpbjogMC41ZW0gMDtcbn1cblxuLnNwYWNlciB7XG5cdGZsZXg6IDEgMSBhdXRvO1xufVxuXG5tYXQtdG9vbGJhciB7XG5cdGhlaWdodDogZml0LWNvbnRlbnQ7XG5cdHdpZHRoOiAxMDAlO1xufVxubWF0LXNwaW5uZXJ7XG5cdHdpZHRoOiAzMHB4ICFpbXBvcnRhbnQ7XG5cdGhlaWdodDogMzBweCAhaW1wb3J0YW50O1xufVxuXG5idXR0b24ge1xuXHRtYXJnaW46IDAgMC41ZW07XG59Il0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 4268:
/*!***************************************************!*\
  !*** ./src/app/components/view/view.component.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ViewComponent: () => (/* binding */ ViewComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _layout_layout_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../layout/layout.component */ 2952);



function ViewComponent_span_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" \"", ctx_r0.test.label, "\"");
  }
}
function ViewComponent_img_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "img", 6);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("src", ctx_r1.test.image, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
  }
}
class ViewComponent {}
ViewComponent.ɵfac = function ViewComponent_Factory(t) {
  return new (t || ViewComponent)();
};
ViewComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
  type: ViewComponent,
  selectors: [["app-view"]],
  inputs: {
    test: "test",
    isTestStarted: "isTestStarted",
    isTestStoped: "isTestStoped"
  },
  decls: 8,
  vars: 2,
  consts: [["actionAlign", "end"], [1, "header"], [4, "ngIf"], [1, "body"], [1, "infos"], ["class", "dip-img", "alt", "", 3, "src", 4, "ngIf"], ["alt", "", 1, "dip-img", 3, "src"]],
  template: function ViewComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "app-layout", 0)(1, "div", 1)(2, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, " DIP ");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](4, ViewComponent_span_4_Template, 2, 1, "span", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](6, "div", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, ViewComponent_img_7_Template, 1, 1, "img", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.test);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.test && ctx.test.image);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _layout_layout_component__WEBPACK_IMPORTED_MODULE_0__.LayoutComponent],
  styles: [".dip-img[_ngcontent-%COMP%] {\n  display: block;\n  max-width: 30%;\n  width: auto;\n  height: auto;\n  margin: auto;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY29tcG9uZW50cy92aWV3L3ZpZXcuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDQyxjQUFBO0VBQ0EsY0FBQTtFQUVBLFdBQUE7RUFDQSxZQUFBO0VBRUEsWUFBQTtBQUREIiwic291cmNlc0NvbnRlbnQiOlsiLmRpcC1pbWd7XG5cdGRpc3BsYXk6IGJsb2NrO1xuXHRtYXgtd2lkdGg6MzAlO1xuXHQvLyBtYXgtaGVpZ2h0Ojk1cHg7XG5cdHdpZHRoOiBhdXRvO1xuXHRoZWlnaHQ6IGF1dG87XG5cdFxuXHRtYXJnaW46IGF1dG87XG59Il0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 5481:
/*!************************************!*\
  !*** ./src/app/core/interfaces.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CommandStatus: () => (/* binding */ CommandStatus)
/* harmony export */ });
var CommandStatus;
(function (CommandStatus) {
  CommandStatus["UNDEFINED"] = "UNDEFINED";
  CommandStatus["PAUSED"] = "PAUSED";
  CommandStatus["STARTED"] = "STARTED";
  CommandStatus["STOPED"] = "STOPED";
  CommandStatus["END"] = "END";
  CommandStatus["ERROR"] = "ERROR";
})(CommandStatus || (CommandStatus = {}));

/***/ }),

/***/ 1732:
/*!***********************************************!*\
  !*** ./src/app/core/services/http.service.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HttpService: () => (/* binding */ HttpService)
/* harmony export */ });
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../environments/environment */ 1594);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 4860);



class HttpService {
  constructor(http) {
    this.http = http;
    this.url = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}`;
  }
  // TESTS
  getTests() {
    const url = `${this.url}/tests`;
    return this.http.get(url);
  }
  getTest(id) {
    const url = `${this.url}/tests/${id}`;
    return this.http.get(url);
  }
  // START / STOP TEST
  startTest(test) {
    const url = `${this.url}/start/${test.id}`;
    return this.http.get(url, {
      responseType: 'text'
    });
  }
  stopTest(test) {
    const url = `${this.url}/stop/${test.id}`;
    return this.http.get(url, {
      responseType: 'text'
    });
  }
  // RESULTS
  listenTest(test) {
    const url = `${this.url}/listen`;
    // const body = {test: test};
    return this.http.post(url, test);
  }
}
HttpService.ɵfac = function HttpService_Factory(t) {
  return new (t || HttpService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
};
HttpService.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
  token: HttpService,
  factory: HttpService.ɵfac,
  providedIn: 'root'
});

/***/ }),

/***/ 9881:
/*!************************************************!*\
  !*** ./src/app/core/services/utils.service.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UtilsService: () => (/* binding */ UtilsService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/snack-bar */ 9409);


class UtilsService {
  constructor(_snackBar) {
    this._snackBar = _snackBar;
  }
  showSnackMessage(message, action, duration) {
    if (duration) {
      this._snackBar.open(message, action, {
        duration: duration * 1000
      });
    } else {
      this._snackBar.open(message, action);
    }
  }
}
UtilsService.ɵfac = function UtilsService_Factory(t) {
  return new (t || UtilsService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_1__.MatSnackBar));
};
UtilsService.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
  token: UtilsService,
  factory: UtilsService.ɵfac,
  providedIn: 'root'
});

/***/ }),

/***/ 9053:
/*!****************************************************!*\
  !*** ./src/app/core/services/websocket.service.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WebsocketService: () => (/* binding */ WebsocketService)
/* harmony export */ });
/* harmony import */ var rxjs_webSocket__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/webSocket */ 7730);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 2235);
/* harmony import */ var src_app_environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/environments/environment */ 1594);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 1699);




class WebsocketService {
  constructor() {}
  listen() {
    return new rxjs__WEBPACK_IMPORTED_MODULE_1__.Observable(subscriber => {
      this.socket$ = (0,rxjs_webSocket__WEBPACK_IMPORTED_MODULE_2__.webSocket)(src_app_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.websocketURL);
      const messageSubscription = this.socket$.subscribe({
        next: data => {
          // console.log('Message reçu :', data)
          subscriber.next(data);
        },
        error: err => {
          // console.error('Erreur WebSocket :', err);
          subscriber.error(err);
        },
        complete: () => {
          subscriber.complete();
        }
      });
      // Nettoyage lors de la désinscription de l'Observable
      return () => {
        messageSubscription.unsubscribe();
        if (this.socket$) {
          this.socket$.complete();
        }
      };
    });
  }
  sendMessage(data) {
    this.socket$.next(data);
  }
}
WebsocketService.ɵfac = function WebsocketService_Factory(t) {
  return new (t || WebsocketService)();
};
WebsocketService.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
  token: WebsocketService,
  factory: WebsocketService.ɵfac,
  providedIn: 'root'
});

/***/ }),

/***/ 1594:
/*!*********************************************!*\
  !*** ./src/app/environments/environment.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   environment: () => (/* binding */ environment)
/* harmony export */ });
const environment = {
  production: false,
  useMocks: false,
  apiUrl: 'http://127.0.0.1:3000/api',
  websocketURL: 'ws://localhost:8080',
  appName: 'DIP Test server'
};

/***/ }),

/***/ 9099:
/*!************************************!*\
  !*** ./src/app/material.module.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MaterialModule: () => (/* binding */ MaterialModule)
/* harmony export */ });
/* harmony import */ var _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/grid-list */ 647);
/* harmony import */ var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/toolbar */ 2484);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/card */ 8497);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/button */ 895);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/select */ 6355);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/icon */ 6515);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/divider */ 9400);
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/progress-bar */ 8173);
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/checkbox */ 6658);
/* harmony import */ var _angular_material_tree__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/tree */ 7321);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/progress-spinner */ 3910);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/snack-bar */ 9409);
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/chips */ 1757);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);














class MaterialModule {}
MaterialModule.ɵfac = function MaterialModule_Factory(t) {
  return new (t || MaterialModule)();
};
MaterialModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
  type: MaterialModule
});
MaterialModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
  imports: [_angular_material_grid_list__WEBPACK_IMPORTED_MODULE_1__.MatGridListModule, _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_2__.MatToolbarModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_3__.MatCardModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_4__.MatDividerModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_5__.MatButtonModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__.MatIconModule, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_7__.MatProgressBarModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_8__.MatSelectModule, _angular_material_tree__WEBPACK_IMPORTED_MODULE_9__.MatTreeModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_10__.MatCheckboxModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_11__.MatProgressSpinnerModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_12__.MatSnackBarModule, _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__.MatChipsModule, _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_1__.MatGridListModule, _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_2__.MatToolbarModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_3__.MatCardModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_4__.MatDividerModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_5__.MatButtonModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__.MatIconModule, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_7__.MatProgressBarModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_8__.MatSelectModule, _angular_material_tree__WEBPACK_IMPORTED_MODULE_9__.MatTreeModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_10__.MatCheckboxModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_11__.MatProgressSpinnerModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_12__.MatSnackBarModule, _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__.MatChipsModule]
});
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](MaterialModule, {
    imports: [_angular_material_grid_list__WEBPACK_IMPORTED_MODULE_1__.MatGridListModule, _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_2__.MatToolbarModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_3__.MatCardModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_4__.MatDividerModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_5__.MatButtonModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__.MatIconModule, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_7__.MatProgressBarModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_8__.MatSelectModule, _angular_material_tree__WEBPACK_IMPORTED_MODULE_9__.MatTreeModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_10__.MatCheckboxModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_11__.MatProgressSpinnerModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_12__.MatSnackBarModule, _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__.MatChipsModule],
    exports: [_angular_material_grid_list__WEBPACK_IMPORTED_MODULE_1__.MatGridListModule, _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_2__.MatToolbarModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_3__.MatCardModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_4__.MatDividerModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_5__.MatButtonModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__.MatIconModule, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_7__.MatProgressBarModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_8__.MatSelectModule, _angular_material_tree__WEBPACK_IMPORTED_MODULE_9__.MatTreeModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_10__.MatCheckboxModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_11__.MatProgressSpinnerModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_12__.MatSnackBarModule, _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__.MatChipsModule]
  });
})();

/***/ }),

/***/ 4913:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ 6480);
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hammerjs */ 4700);
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app/app.module */ 8629);



_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_1__.AppModule).catch(err => console.error(err));

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(4913)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map