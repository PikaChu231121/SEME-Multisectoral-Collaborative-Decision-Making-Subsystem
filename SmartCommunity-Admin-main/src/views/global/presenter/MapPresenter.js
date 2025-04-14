import mapModel from '../model/mapModel';

export default class MapPresenter {
  constructor(router, view) {
    this.view = view; // View实例
    this.map = null; // 地图实例
    this.baseLayers = null; // 图层实例
    this.buildingLayer = null; // 楼宇图层
    this.flamingSmokeDetection = null; // 着火烟感
    this.router = router;
  }

  async init() {
    try {
      await mapModel.loadAMapScript(); // 加载地图脚本
      this.initMap(); // 初始化地图
    } catch (error) {
      console.error(error);
      this.view.showError(error.message); // 通知View显示错误
    }
  }

  initMap() {
    var containerId = 'container';
    var centerPosition = mapModel.getCommunityCenter();

    this.map = new AMap.Map(containerId, {
      center: centerPosition,
      viewMode: '3D',
      pitch: 70,
      rotation: -40,
      features: ['bg', 'road', 'point'],
      mapStyle: 'amap://styles/normal',
      zoom: 16,
      doubleClickZoom: false,
      pitch: 45,
      showBuildingBlock: false,
    });

    this.baseLayers = this.map.getLayers();

    this.buildingLayer = new AMap.Buildings({
      zooms: [12, 30],
      zIndex: 10,
      heightFactor: 4,
      opacity: 1,
    });

    this.changeBuildingLayers(mapModel.getBuildingAllZones()); // 更改楼宇图层
    this.addCommunityPoints(); // 添加社区点标记
    this.addDevicePoints();
    this.addPolygonEditor(); // 添加多边形编辑器
    //this.addMapClickEvent();
  }

  changeBuildingLayers(areas) {
    var buildingStyle = {
      hideWithoutStyle: true, //是否隐藏设定区域外的楼块
      areas: areas,
    };
    this.buildingLayer.setStyle(buildingStyle);
    var temp = Array.from(this.baseLayers);
    temp.push(this.buildingLayer);
    this.map.setLayers(temp);
  }

  addCommunityPoints() {
    var communityPoints = mapModel.getCommunityPoints(); // 从Model获取维修点数据

    communityPoints.forEach((point) => {
      new AMap.Marker({
        position: point.position,
        title: point.name,
        map: this.map,
      });
    });
  }

  addDevicePoints() {
    var devicePoints = mapModel.getDevicePoints(); // 从Model获取维修点数据

    Object.keys(devicePoints).forEach((deviceType) => {
      devicePoints[deviceType].points.forEach((devicePoint) => {
        const marker = new AMap.Marker({
          position: devicePoint.position,
          map: this.map,
          icon: new AMap.Icon({ image: devicePoint.image }),
          zooms: devicePoint.zooms,
        });

        marker.on('click', () => {
          this.router.push(devicePoints[deviceType].route);
        });

        if (deviceType === 'smoke_detection') {
          this.flamingSmokeDetection = marker;
        }
      });
    });
  }

  async addPolygonEditor() {
    // 绘制同济大学嘉定校区边界
    var communityBoundaryPolygon = new AMap.Polygon({
      path: mapModel.getCommunityBoundary(),
      bubble: true,
      fillOpacity: 0.1,
      strokeWeight: 5,
    });

    this.map.add([communityBoundaryPolygon]);

    var repairInfoWindow = new AMap.InfoWindow({
      offset: new AMap.Pixel(0, -30),
    });

    // 分页配置
    const pageSize = 1; // 每页展示1个报修信息
    let currentPage = 1; // 当前页
    let totalPages = null; // 总页数
    let repairInfo = null;
    let buildingInfo = null;

    // 绘制隐形楼宇边界
    const buildings = await mapModel.getBuildingInfo();
    buildings.forEach((building) => {
      var buildingBoundary = building.boundary;
      var buildingBoundaryPolygon = new AMap.Polygon({
        path: buildingBoundary,
        fillOpacity: 0.1,
        strokeOpacity: 0,
      });

      // 改变页码并更新窗口内容
      window.changePage = (direction, totalPages) => {
        console.log('changePage', totalPages);
        if (direction === 'prev' && currentPage > 1) {
          currentPage--;
          console.log('prev', totalPages);
          repairInfoWindow.setContent(getRepairInfoContent(currentPage)); // 更新窗口内容为新页面的修复信息
        } else if (direction === 'next' && currentPage < totalPages) {
          currentPage++;
          console.log('next', currentPage);
          repairInfoWindow.setContent(getRepairInfoContent(currentPage)); // 更新窗口内容为新页面的修复信息
        }
      };

      // 分页显示修复信息
      const getRepairInfoContent = (page) => {
        const start = (page - 1) * pageSize;
        const end = page * pageSize;
        const pageData = repairInfo.slice(start, end);

        return `
          <div>
            <h2>${buildingInfo.basicInfo.buildingName}</h2>
            ${pageData
              .map(
                (info) => `
                <div style="border-top: 1px solid #ccc; padding-top: 10px;">
                  <p><strong>居民编号：</strong>${info.residentID}</p>
                  <p><strong>报修标题：</strong>${info.repairIssueTitle}</p>
                  <p><strong>报修问题细节：</strong>${info.repairIssueDetails}</p>
                  <p><strong>维修状态：</strong>${info.repairIssueStatus}</p>
                  <p><strong>故障类型：</strong>${info.repairIssueCategory}</p>
                </div>`,
              )
              .join('')}
            <div style="text-align: center;">
              <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage('prev',${totalPages})">上一页</button>
              <span>第 ${currentPage} 页 / 共 ${totalPages} 页</span>
              <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage('next',${totalPages})">下一页</button>
            </div>
          </div>
        `;
      };

      //鼠标移入更改样式
      var buildingCenter = [
        buildingBoundary.reduce((acc, val) => acc + val[0], 0) / buildingBoundary.length,
        buildingBoundary.reduce((acc, val) => acc + val[1], 0) / buildingBoundary.length,
      ];

      buildingBoundaryPolygon.on('mouseover', () => {
        buildingInfo = building.info;
        repairInfo = buildingInfo.repairInfo;
        currentPage = 1;
        if (repairInfo.length > 0) {
          totalPages = Math.ceil(repairInfo.length / pageSize);
          repairInfoWindow.setContent(getRepairInfoContent(currentPage)); // 更新窗口内容为当前页的修复信息
          repairInfoWindow.open(this.map, buildingCenter);
        }
        //鼠标左键双击跳转
        buildingBoundaryPolygon.on('dblclick', () => {
          if (repairInfoWindow.getIsOpen()) {
            this.router.push('/repair/display');
          }
        });
      });
      this.map.add([buildingBoundaryPolygon]);
    });

    // 启用多边形编辑器
    AMap.plugin(['AMap.PolygonEditor'], () => {
      this.polyEditor = new AMap.PolygonEditor(this.map);
      this.polyEditor.on('add', (data) => {
        // 编辑过程创建一个管理区域
        var polygon = data.target;
        polygon.on('dblclick', () => {
          this.polyEditor.setTarget(polygon);
          this.polyEditor.open();
        });
      });
      this.polyEditor.on('end', (data) => {
        // 记录编辑完成区域
        var path = data.target.getPath();
        var pointsArray = '边界框所有点经纬度：\n[';
        path.forEach((point, _) => {
          pointsArray += `[${point.lng}, ${point.lat}]`;
          pointsArray += ',';
        });
        console.log(pointsArray + ']');
      });
    });
  }

  showFlamingSmokeDetection() {
    this.flamingSmokeDetection.show();
  }

  hideFlamingSmokeDetection() {
    this.flamingSmokeDetection.hide();
  }

  // // 监听编辑事件，检查是否超出边界（此处假设一个边界）
  // handleVertexChange() {
  //   var path = this.polygon.getPath();

  //   // 定义一个边界区域（例如：矩形区域）
  //   var boundary = mapModel.getCommunityBoundary();

  //   path.forEach((point, index) => {
  //     if (!this.isPointInsideBoundary(point, boundary)) {
  //       // 如果点超出边界，修正该点
  //       var correctedPoint = this.getClosestPointOnBoundary(point, boundary);
  //       path[index] = correctedPoint;
  //       this.polygon.setPath(path); // 更新路径
  //       alert('点超出了边界，已将其移动到边界上！');
  //     }
  //   });
  // }

  // 新建管理区域
  createPolygon() {
    this.polyEditor.close();
    this.polyEditor.setTarget();
    this.polyEditor.open();
  }

  // 结束编辑管理区域
  endEditingPolygon() {
    this.polyEditor.close();
  }

  // 删除管理区域
  removePolygon() {
    var polygon = this.polyEditor.getTarget();
    polygon.destroy();
    this.polyEditor.close();
  }

  // // 判断点是否在指定边界内
  // isPointInsideBoundary(point, boundary) {
  //   var polygon = new AMap.Polygon({ path: boundary });
  //   return AMap.GeometryUtil.isPointInPolygon(point, polygon);
  // }

  // // 获取点到边界的最近点
  // getClosestPointOnBoundary(point, boundary) {
  //   return AMap.GeometryUtil.closestPointOnSegment(point, boundary);
  // }
}
