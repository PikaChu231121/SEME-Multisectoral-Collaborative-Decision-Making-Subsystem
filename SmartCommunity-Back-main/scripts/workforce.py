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
时间：2025年4月15日 08:30
天气：沙尘暴，风力8级
人员情况：楼内可能有10人被困
"""

# === 定义智能体角色 ===

firefighter_agent = ChatAgent(
    system_message="""
你是一个经验丰富的消防员，具备专业的灭火和救援能力。
你将收到一条具体的火灾报警信息（包括地点、火势等级、被困人数等），
你需要根据这些信息，结合消防局和社区的资源（如消防车、水源、灭火器、楼层图等），
在火灾的不同阶段中，提出具体、可执行、与火情相关的灭火与救援方案。
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
制定一个完整的火灾应急响应方案

假设火灾开始于8:30, 结束于10:30

请确保每个角色的响应内容都与当前火情紧密相关，而不是通用模板。
输出结构化时间线，分阶段列出各角色的任务，以及任务详情。并按时间段划分。例如：

{{
      "departments": ["消防", "医院", "安保", "物业"],
      "timeline": [
        {{ "time": "08:30-08:40", 
            "actions": {{
                "消防": {{"name": "任务", "detail": "任务详情"}}, 
                "医院": {{"name": "任务", "detail": "任务详情"}}, 
                "安保": {{"name": "任务", "detail": "任务详情"}}, 
                "物业": {{"name": "任务", "detail": "任务详情"}}, 
            }}
        }},

        {{ "time": "08:40-08:50", 
            "actions": {{
                "消防": {{"name": "任务", "detail": "任务详情"}}, 
                "医院": {{"name": "任务", "detail": "任务详情"}}, 
                "安保": {{"name": "任务", "detail": "任务详情"}}, 
                "物业": {{"name": "任务", "detail": "任务详情"}}, 
            }}
        }},
    
      ]
}}

请确保每个阶段的时间段中列出的任务是角色的具体任务，并按时间顺序排列。没有任务的角色请填入 null。

不要输出任何解释文字，只输出 JSON。
请严格按照以上的输出格式，包括时间段、角色名称和任务详情。
请确保 JSON 格式正确，避免任何语法错误。
""",
    id="fire_task_001"
))

import json
import requests

# === 解析火灾响应主任务结果 ===

url1 = "http://localhost:8080/api/ai-assistant/receive-fire-response"
url2 = "http://localhost:8080/api/get-timeline-response"

try:
    result_json = json.loads(task.result)
    with open("fire_response_result.json", "w", encoding="utf-8") as f:
        json.dump(result_json, f, ensure_ascii=False, indent=4)
    # 只向后端发送数据
    payload = result_json

    # 打印将发送至后端的数据
    print("即将发送至后端的数据:")
    print(json.dumps(payload, ensure_ascii=False, indent=4))

    # 向 Spring Boot 发送数据

    response = requests.post(url1, json=payload)

    # 确保不打印额外的信息，只输出必要的内容
    if response.status_code == 200:
        print(response.text)  # 仅打印后端响应内容
    else:
        print(f"传输失败，状态码: {response.status_code}")

except json.JSONDecodeError:
    # 遇到解析错误时，不打印其他内容
    with open("fire_response_result.txt", "w", encoding="utf-8") as f:
        f.write(task.result)
    result_json = {}

    # 仅将错误信息发送到后端
    payload = result_json

    # 打印将发送至后端的错误数据
    print("即将发送至后端的错误数据:")
    print(json.dumps(payload, ensure_ascii=False, indent=4))

    # 向 Spring Boot 发送数据
    response = requests.post(url1, json=payload)

    if response.status_code == 200:
        print(response.text)  # 仅打印后端响应内容
    else:
        print(f"传输失败，状态码: {response.status_code}")

print("=======================================")

try:
    result_json = json.loads(task.result)
    with open("fire_response_result.json", "w", encoding="utf-8") as f:
        json.dump(result_json, f, ensure_ascii=False, indent=4)
    # 只向后端发送数据
    payload = result_json

    # 向 Spring Boot 发送数据

    response = requests.post(url2, json=payload)

    # 确保不打印额外的信息，只输出必要的内容
    if response.status_code == 200:
        print(response.text)  # 仅打印后端响应内容
    else:
        print(f"传输失败，状态码: {response.status_code}")

except json.JSONDecodeError:
    # 遇到解析错误时，不打印其他内容
    with open("fire_response_result.txt", "w", encoding="utf-8") as f:
        f.write(task.result)
    result_json = {}

    # 仅将错误信息发送到后端
    payload = result_json

    # 向 Spring Boot 发送数据
    response = requests.post(url2, json=payload)

    if response.status_code == 200:
        print(response.text)  # 仅打印后端响应内容
    else:
        print(f"传输失败，状态码: {response.status_code}")