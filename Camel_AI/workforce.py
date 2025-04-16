from camel.agents import ChatAgent
from camel.models import ModelFactory
from camel.societies.workforce import Workforce
from camel.tasks import Task
from camel.types import ModelPlatformType
import json

# === 模型初始化 ===

model = ModelFactory.create(
    model_platform=ModelPlatformType.OPENAI_COMPATIBLE_MODEL,
    model_type="gpt-4.1",
    url="https://api.chatanywhere.tech/v1",
    api_key="sk-qhnDB2E2TSXqioiTzgiByRDzbrtmB755vHqBQTspWsy1DkY8",
    model_config_dict={
        "max_tokens": 32768
    }
)


# === 火灾报警信息 ===

fire_alarm_info = """
火灾发生地点：阳光花园小区，3号楼，5楼
火势等级：中度（黑烟明显，有明火）
报警来源：烟感报警器 + 居民电话报警
时间：2025年4月15日 08:32
天气：沙尘暴，风力8级
人员情况：楼内可能有10人被困
"""

# === 定义智能体角色 ===

firefighter_agent = ChatAgent(
    system_message="""
你是一个经验丰富的消防员，具备专业的灭火和救援能力。
你将收到一条具体的火灾报警信息（包括地点、火势等级、被困人数等），
你需要根据这些信息，结合消防局和社区的资源（如消防车、水源、灭火器、楼层图等），
在火灾的不同阶段（报警初期、救援中期、善后阶段）中，提出具体、可执行、与火情相关的灭火与救援方案。
请避免模板化的回答，必须针对实际火情做出判断。
""",
    model=model,
    output_language='中文'
)

doctor_agent = ChatAgent(
    system_message="""
你是一个专业的急救医生，擅长在火灾等紧急情况下进行伤员救治。
你将收到一条具体的火灾报警信息（包括地点、火势等级、被困人数等），
你需要根据这些信息，结合医院和社区诊所的资源（如急救包、担架、临时医疗点），
在火灾的不同阶段中，提出具体、可执行的医疗响应方案，并与其他角色协同配合。
""",
    model=model,
    output_language='中文'
)

security_agent = ChatAgent(
    system_message="""
你是一个经验丰富的社区保安，擅长在紧急情况下维持秩序和组织疏散。
你将收到一条具体的火灾报警信息（包括地点、火势等级、被困人数等），
你需要根据这些信息，结合社区安保资源（如广播系统、疏散路线、警戒线），
制定合理的秩序维护和疏散方案，并与其他角色协同配合。
""",
    model=model,
    output_language='中文'
)

property_agent = ChatAgent(
    system_message="""
你是一个社区物业管理员，熟悉社区的建筑结构和资源分布。
你将收到一条具体的火灾报警信息（包括地点、火势等级、被困人数等），
你需要根据这些信息，提供关键资源信息（如消防栓位置、电源总闸、应急通道、临时安置点），
支持消防员、医生和保安的工作，确保救援顺利进行。
""",
    model=model,
    output_language='中文'
)

# === 创建工作组 ===

workforce = Workforce(
    description="社区火灾应急处理工作组",
    new_worker_agent_kwargs={'model': model},
    coordinator_agent_kwargs={'model': model},
    task_agent_kwargs={'model': model}
)

# === 添加智能体角色 ===

workforce.add_single_agent_worker(
    description="负责灭火和救援火场人员",
    worker=firefighter_agent,
).add_single_agent_worker(
    description="负责检查伤员并进行紧急救治",
    worker=doctor_agent,
).add_single_agent_worker(
    description="负责组织人员疏散并维护现场秩序",
    worker=security_agent,
).add_single_agent_worker(
    description="负责提供社区资源支持和现场信息",
    worker=property_agent,
)

# === 执行火灾响应主任务 ===

task = workforce.process_task(Task(
    content=f"""
火灾报警信息如下：

{fire_alarm_info}

请你组织消防员、医生、保安、物业四个角色，分别从他们的专业角度出发，
结合上述火灾信息（如地点、火势等级、被困人数等），
制定一个完整的火灾应急响应方案，分为以下三个阶段：

1. 报警初期（0-5分钟）
2. 救援中期（5-30分钟）
3. 善后阶段（30分钟后）

请确保每个角色的响应内容都与当前火情紧密相关，而不是通用模板。
输出结构化时间线，每阶段列出各角色的任务和协作方式。
请将输出格式严格按照以下 JSON 格式返回：

{{
  "阶段一": {{
    "消防员": ["任务1", "任务2"],
    "医生": ["任务1", "任务2"],
    "保安": ["任务1", "任务2"],
    "物业": ["任务1", "任务2"]
  }},
  "阶段二": {{
    ...
  }},
  "阶段三": {{
    ...
  }}
}}
不要输出任何解释文字，只输出 JSON。
""",
    id="fire_task_001"
))
import json
import requests

# === 解析火灾响应主任务结果 ===

try:
    result_json = json.loads(task.result)
    with open("fire_response_result.json", "w", encoding="utf-8") as f:
        json.dump(result_json, f, ensure_ascii=False, indent=4)
    print("✅ 火灾响应 JSON 已保存")
except json.JSONDecodeError:
    print("❌ 火灾响应解析失败，保存为文本")
    with open("fire_response_result.txt", "w", encoding="utf-8") as f:
        f.write(task.result)
    result_json = {}
    print(task.result)

# === 构建 summary（仅使用阶段一简要概括） ===

summary_data = []
first_stage = result_json.get("阶段一", {})
for role, tasks in first_stage.items():
    summary_data.append({
        "role": role,
        "status": "已完成",
        "summary": "，".join(tasks)
    })

# === 执行智能体任务：分析优先级和资源调配 ===

priority_resource_task = Task(
    content=f"""
以下是当前的火灾报警信息：

{fire_alarm_info}

请你根据这次火灾的严重程度、人员情况和天气情况，提出：

1. 火灾应急响应中的**任务优先级排序**（如：控制火源 > 疏散人员 > 保护财产 > 记录损失）
2. 所需的关键**资源调配建议**（如消防车、救护车、安保人员、志愿者的数量和状态）

请用如下 JSON 格式输出：

{{
  "priority": [
    {{"level": "紧急", "task": "任务内容"}}
  ],
  "resources": [
    {{"type": "资源类型", "status": "数量+状态描述"}}
  ]
}}

不要输出任何解释文字，只返回 JSON。
""",
    id="fire_task_priority"
)
priority_resource_task = workforce.process_task(priority_resource_task)

# === 解析优先级与资源调配结果 ===

try:
    priority_resource_json = json.loads(priority_resource_task.result)
    priority_list = priority_resource_json.get("priority", [])
    resources_allocation = priority_resource_json.get("resources", [])
except json.JSONDecodeError:
    print("❌ 无法解析优先级与资源调配 JSON，使用默认值。")
    priority_list = [
        {"level": "紧急", "task": "疏散被困人员"},
        {"level": "紧急", "task": "控制火源蔓延"},
        {"level": "中等", "task": "保护周边财产"},
        {"level": "常规", "task": "记录损失情况"}
    ]
    resources_allocation = [
        {"type": "消防车", "status": "2辆 已调派"},
        {"type": "救护车", "status": "1辆 待命"},
        {"type": "安保人员", "status": "4名 现场"},
        {"type": "志愿者", "status": "6名 待命"}
    ]

# === 构造并上传 payload 到 Spring Boot ===

payload = {
    "stages": result_json,
    "summary": summary_data,
    "priority": priority_list,
    "resources": resources_allocation
}

url = "http://localhost:8080/api/ai-assistant/receive-fire-response"
response = requests.post(url, json=payload)

if response.status_code == 200:
    print("✅ 成功传输到 Spring Boot：", response.text)
else:
    print("❌ 传输失败，状态码:", response.status_code)