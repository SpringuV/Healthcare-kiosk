from ..crud.order_crud import get_orders, get_dashboard_infos
from ..crud.order_crud import set_pay_cash_order

def getListOrders(search: str, skip: int):
    if search == "empty":
        search = ""
    orders = get_orders(search, skip)
    data = [{
        "fullname": o["fullname"], 
        "citizen_id": o["citizen_id"],
        "dob": o["dob"].isoformat(), 
        "insurance_id": o["insurance_id"],
        "service_name": o["service_name"], 
        "create_at": o["create_at"].isoformat(),
        "payment_method": o["payment_method"], 
        "payment_status": o["payment_status"],
        "price": float(o["price"]), 
        "queue_number": o["queue_number"],
        "clinic_name": o["clinic_name"], 
        "address_room": o["address_room"],
        "doctor_name": o["doctor_name"]
    } for o in orders]
    return data

def payCashOrder(order_id: str):
    set_pay_cash_order(order_id)

def getDashboardInfos():
    raw_data = get_dashboard_infos()
    datas = []
    for info in raw_data:
        datas.append({
            "order_date": info["order_date"].isoformat(),
            "order_money": float(info["order_money"]),
            "total_paid_orders": info["total_paid_orders"],
            "total_unpaid_orders": info["total_unpaid_orders"],
            "total_cancelled_orders": info["total_cancelled_orders"]
        })
    return datas