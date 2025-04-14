import axios from 'axios';
import smokeDetectionIcon from '@/assets/images/smoke_detection.svg';
import cameraIcon from '@/assets/images/camera.svg';
import serverIcon from '@/assets/images/server.svg';
import hospitalIcon from '@/assets/images/hospital.svg';
import fireFightingIcon from '@/assets/images/fire_fighting.svg';
import residentialPropertyIcon from '@/assets/images/residential_property.svg';
import securityIcon from '@/assets/images/security.svg';

export default {
  async loadAMapScript() {
    if (typeof AMap !== 'undefined') {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//webapi.amap.com/maps?v=2.0&key=0e71ac9fd9927f54b49e0295bf786080';
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error('高德地图脚本加载失败'));
      document.head.appendChild(script);
    });
  },

  getCommunityCenter() {
    return [121.215252, 31.285054];
  },

  getCommunityPoints() {
    return [
      // {
      //   id: 1,
      //   name: '惟新馆',
      //   position: [121.209694, 31.285546],
      //   type: 'Structural Issue',
      // },
      {
        id: 2,
        name: '友元10号楼',
        position: [121.219049, 31.286975],
        type: 'Structural Issue',
      },
      {
        id: 3,
        name: '济事楼',
        position: [121.214077, 31.28188],
        type: 'Structural Issue',
      },
      {
        id: 4,
        name: '体育中心',
        position: [121.215997, 31.290296],
        type: 'Structural Issue',
      },
      {
        id: 5,
        name: '图书馆',
        position: [121.211981, 31.286598],
        type: 'Structural Issue',
      },
    ];
  },

  getCommunityBoundary() {
    // 目前是嘉定校区边界
    return [
      [121.205306, 31.289821],
      [121.206728, 31.288265],
      [121.207444, 31.287513],
      [121.208077, 31.286854],
      [121.206959, 31.285838],
      [121.207588, 31.285476],
      [121.207284, 31.285206],
      [121.2088, 31.284169],
      [121.210973, 31.282599],
      [121.212899, 31.281138],
      [121.214831, 31.279627],
      [121.217776, 31.277489],
      [121.221099, 31.281622],
      [121.222109, 31.282946],
      [121.220406, 31.283944],
      [121.218943, 31.284967],
      [121.219524, 31.286226],
      [121.21947, 31.287405],
      [121.218566, 31.287589],
      [121.218608, 31.288469],
      [121.220376, 31.28863],
      [121.22112, 31.289621],
      [121.221381, 31.290695],
      [121.21894, 31.291154],
      [121.217674, 31.291335],
      [121.216264, 31.29141],
      [121.213981, 31.291472],
      [121.211642, 31.291541],
      [121.207026, 31.291668],
    ];
  },

  // 楼宇信息
  async getBuildingInfo() {
    let buildings = [
      // {
      //   boundary: [
      //     [121.209221, 31.28578],
      //     [121.209229, 31.285182],
      //     [121.210161, 31.28518],
      //     [121.210161, 31.285775],
      //   ],
      //   info: {
      //     basicInfo: {
      //       buildingId: 1,
      //       buildingName: '惟新馆',
      //     },
      //     repairInfo: [],
      //   },
      // },
      {
        boundary: [
          [121.214526, 31.282222],
          [121.214744, 31.281799],
          [121.214346, 31.281258],
          [121.213793, 31.281675],
          [121.213814, 31.282308],
        ],
        info: {
          basicInfo: {
            buildingId: 2,
            buildingName: '济事楼',
          },
          repairInfo: [],
        },
      },
      {
        boundary: [
          [121.212019, 31.286302],
          [121.211569, 31.286593],
          [121.211867, 31.286947],
          [121.212298, 31.286681],
        ],
        info: {
          basicInfo: {
            buildingId: 3,
            buildingName: '图书馆',
          },
          repairInfo: [],
        },
      },
      {
        boundary: [
          [121.218418, 31.286655],
          [121.218428, 31.28684],
          [121.219256, 31.286807],
          [121.219263, 31.286601],
          [121.218927, 31.286598],
        ],
        info: {
          basicInfo: {
            buildingId: 4,
            buildingName: '友园10号楼',
          },
          repairInfo: [],
        },
      },
      {
        boundary: [
          [121.215081, 31.289747],
          [121.215713, 31.289735],
          [121.215705, 31.28954],
          [121.21629, 31.289589],
          [121.216373, 31.290731],
          [121.215592, 31.290588],
          [121.215141, 31.290366],
        ],
        info: {
          basicInfo: {
            buildingId: 5,
            buildingName: '体育中心',
          },
          repairInfo: [],
        },
      },
    ];
    try {
      const response = await axios.get('http://localhost:8080/api/repair-issues'); // 获取所有报修事件
      const repairIssues = response.data; // 假设接口返回的数据是数组形式
      // 遍历每个建筑物，将符合条件的报修事件映射到相应的建筑物
      buildings.forEach((building) => {
        // 遍历报修事件
        repairIssues.forEach((repair) => {
          // 如果报修事件的repairAddress匹配当前建筑物的名称（或者通过其他方式匹配）
          if (repair.repairIssueStatus == 'Pending') {
            repair.repairIssueStatus = '待处理';
          } else if (repair.repairIssueStatus == 'Inprogress') {
            repair.repairIssueStatus = '处理中';
          } else {
            repair.repairIssueStatus = '已完成';
          }

          if (repair.repairIssueCategory == 'Plumbing') {
            repair.repairIssueCategory = '管道';
          } else if (repair.repairIssueCategory == 'Electrical') {
            repair.repairIssueCategory = '电器';
          } else if (repair.repairIssueCategory == 'Network') {
            repair.repairIssueCategory = '网络';
          } else if (repair.repairIssueCategory == 'Window') {
            repair.repairIssueCategory = '门窗';
          } else if (repair.repairIssueCategory == 'Elevator') {
            repair.repairIssueCategory = '电梯';
          } else if (repair.repairIssueCategory == 'Lighting') {
            repair.repairIssueCategory = '照明';
          } else {
            repair.repairIssueCategory = '其他';
          }

          if (repair.repairAddress.includes(building.info.basicInfo.buildingName)) {
            building.info.repairInfo.push(repair); // 将该报修事件添加到该建筑物的repairInfo
          }
        });
      });

      return buildings; // 返回更新后的建筑物信息
    } catch (error) {
      console.error('Error fetching repair issues:', error);
      return [];
    }
  },

  // 楼宇分区
  _getBuildingZoneData() {
    return {
      // 学院区
      collegeZone: {
        color1: '#ffff00', //楼顶颜色
        color2: '#ffcc00', //楼面颜色
        path: [
          [121.214927, 31.291405],
          [121.207062, 31.291616],
          [121.205421, 31.289769],
          [121.208235, 31.286806],
          [121.207114, 31.285883],
          [121.20761, 31.285426],
          [121.218088, 31.27801],
          [121.221857, 31.28264],
          [121.221132, 31.283006],
          [121.218222, 31.280593],
          [121.211661, 31.285295],
          [121.214549, 31.288867],
        ],
      },
      // 宿舍区
      dormZone: {
        color1: '#90EE90', //楼顶颜色
        color2: '#228B22', //楼面颜色
        path: [
          [121.22127, 31.290649],
          [121.217844, 31.29119],
          [121.217071, 31.288279],
          [121.217465, 31.288089],
          [121.217506, 31.287985],
          [121.217792, 31.28779],
          [121.218009, 31.28769],
          [121.218111, 31.287056],
          [121.217682, 31.287203],
          [121.217464, 31.28694],
          [121.217151, 31.287038],
          [121.216956, 31.286791],
          [121.216354, 31.287045],
          [121.215962, 31.287044],
          [121.215808, 31.286458],
          [121.21669, 31.286041],
          [121.21838, 31.285052],
          [121.21778, 31.283775],
          [121.219271, 31.282746],
          [121.220212, 31.283894],
          [121.218836, 31.284951],
          [121.219436, 31.286218],
          [121.219363, 31.287221],
          [121.218428, 31.287602],
          [121.218532, 31.288583],
          [121.218917, 31.289636],
          [121.220095, 31.289459],
          [121.22096, 31.289746],
        ],
      },
      // 生活区
      livingZone: {
        color1: '#87CEFA', //楼顶颜色
        color2: '#1F77B4', //楼面颜色
        path: [
          [121.214943, 31.290827],
          [121.214829, 31.288603],
          [121.214114, 31.287446],
          [121.215481, 31.286565],
          [121.215975, 31.28712],
          [121.216995, 31.286828],
          [121.217144, 31.287035],
          [121.217478, 31.286931],
          [121.217673, 31.287186],
          [121.218147, 31.287088],
          [121.218111, 31.287583],
          [121.217547, 31.287871],
          [121.217416, 31.288072],
          [121.216928, 31.28832],
          [121.216545, 31.290928],
        ],
      },
      // 教学区
      teachingZone: {
        color1: '#FF6347', //楼顶颜色
        color2: '#C71585', //楼面颜色
        path: [
          [121.213913, 31.287399],
          [121.212651, 31.285551],
          [121.217051, 31.282811],
          [121.218462, 31.284755],
        ],
      },
    };
  },

  getBuildingAllZones() {
    return Object.values(this._getBuildingZoneData());
  },

  getBuildingSomeZones(zoneNames) {
    return zoneNames.map((zoneName) => this._getBuildingZoneData()[zoneName]);
  },

  getDevicePoints() {
    return {
      smoke_detection: {
        route: '/decision',
        points: [
          {
            id: 1,
            name: '烟感设备',
            position: [121.2086, 31.290306],
            image: smokeDetectionIcon,
            zooms: [16, 20],
          },
          {
            id: 2,
            name: '烟感设备',
            position: [121.219228, 31.284488],
            image: smokeDetectionIcon,
            zooms: [16, 20],
          },
        ],
      },
      camera: {
        route: '/video',
        points: [
          {
            id: 1,
            name: '摄像头',
            position: [121.2091, 31.290306],
            image: cameraIcon,
            zooms: [16, 20],
          },
          {
            id: 2,
            name: '摄像头',
            position: [121.214217, 31.282486],
            image: cameraIcon,
            zooms: [16, 20],
          },
        ],
      },
      server: {
        route: '/task',
        points: [
          {
            id: 1,
            name: '服务器',
            position: [121.214541, 31.282081],
            image: serverIcon,
            zooms: [16, 20],
          },
        ],
      },
      hospital: {
        points: [
          {
            id: 1,
            name: '医疗部门',
            position: [121.2153, 31.289399],
            image: hospitalIcon,
            zooms: [16, 20],
          },
        ],
      },
      fire_fighting: {
        points: [
          {
            id: 1,
            name: '消防部门',
            position: [121.218728, 31.28634],
            image: fireFightingIcon,
            zooms: [16, 20],
          },
        ],
      },
      residential_property: {
        points: [
          {
            id: 1,
            name: '居住物业部门',
            position: [121.209621, 31.2861],
            image: residentialPropertyIcon,
            zooms: [16, 20],
          },
        ],
      },
      security: {
        points: [
          {
            id: 1,
            name: '安保部门',
            position: [121.21001, 31.2895],
            image: securityIcon,
            zooms: [16, 20],
          },
        ],
      },
    };
  },

  getDevice2Route() {
    return {
      smoke_detection: '/decision',
      camera: 'video',
      server: 'task',
    };
  },
};
