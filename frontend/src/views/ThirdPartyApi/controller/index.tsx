import { post } from "@/api"
import { message, useDialog } from "@/utils/naive-tools"
import { NButton } from 'naive-ui'
import { getRandomStringFromSet } from "@/utils/tools"
import { sendLog } from "@/views/Home/controller"
import type { ThirdPartyApiServiceItem, AddThirdPartySupplierMode } from '@/views/Home/dto';
import { getEmbeddingModels, get_model_list } from "@/views/Settings/controller"
import i18n from "@/lang";

import { getThirdPartyApiStoreData } from "../store"

const $t = i18n.global.t


/**
 * @description 获取第三方供应商列表
 */
export async function getSupplierList() {
    const { thirdPartyApiServiceList, currentChooseApi, applierServiceConfig } = getThirdPartyApiStoreData()
    try {
        const res = await post("/model/get_supplier_list")
        thirdPartyApiServiceList.value = res.message
        currentChooseApi.value = res.message[0]
        getSupplierConfig(res.message[0])
    } catch (error) {
        sendLog(error as Error)
    }
}

/**
 * @description 获取模型供应商api配置
 */
export async function getSupplierConfig(config: ThirdPartyApiServiceItem) {
    const { currentChooseApi, applierServiceConfig } = getThirdPartyApiStoreData()
    try {
        const res = await post("/model/get_supplier_config", {
            supplierName: currentChooseApi.value?.supplierName
        })
        applierServiceConfig.value.apiKey = res.message.apiKey
        if (config.baseUrl) {
            applierServiceConfig.value.baseUrl = config.baseUrl
        } else {
            applierServiceConfig.value.baseUrl = res.message.baseUrlExample
        }
        getSupplierModelList(currentChooseApi.value?.supplierName!)
    } catch (error) {
        sendLog(error as Error)
    }
}

/**
 * @description 获取指定服务商下的模型列表
 */
export async function getSupplierModelList(supplierName: string) {
    const { supplierModelList, isAllModelEnable } = getThirdPartyApiStoreData()
    try {
        const res = await post("/model/get_models_list", { supplierName })
        supplierModelList.value = res.message.filter((item: any) => item.title !== "")
        isAllModelEnable.value = supplierModelList.value.every((item: any) => item.status == true)
    } catch (error) {
        sendLog(error as Error)
    }
}


/**
 * @description 添加模型
 */
export async function addModels() {
    const { addModelFormData, currentChooseApi } = getThirdPartyApiStoreData()
    try {
        const res = await post("/model/add_models", {
            supplierName: currentChooseApi.value?.supplierName,
            ...addModelFormData.value,
            capability: JSON.stringify(addModelFormData.value.capability)
        })
        await getEmbeddingModels()
        await get_model_list()
    } catch (error) {
        sendLog(error as Error)
    }
}
/**
 * @description 修改模型服务商
 */
export async function editModels() {
    const { addModelFormData, currentChooseApi } = getThirdPartyApiStoreData();
    try {
        const { status, ...filteredFormData } = addModelFormData.value;
        const res = await post('/model/modify_model', {
            ...filteredFormData,
            supplierName: currentChooseApi.value?.supplierName,
            capability: JSON.stringify(addModelFormData.value.capability),
        });
        await getEmbeddingModels();
        await get_model_list();
    } catch (error) {
        sendLog(error as Error);
    }
}

/**
 * @description 添加模型服务商
 */
export async function addSupplier() {
    const { addSupplierFormData } = getThirdPartyApiStoreData()
    const supplierName = getRandomStringFromSet(10)
    await post("/model/add_supplier", { ...addSupplierFormData.value, supplierName })
}

/**
 * @description 检查配置是否正确
 */
export async function checkSupplierConfig() {
    const { applierServiceConfig, currentChooseApi } = getThirdPartyApiStoreData()
    const res = await post("/model/check_supplier_config", { ...applierServiceConfig.value, supplierName: currentChooseApi.value?.supplierName })
    return res.msg
}

/**
 * @description 删除模型供应商
 */
export async function removeSupplier(supplierName: string) {
    try {
        await post("/model/remove_supplier", { supplierName })
        await getSupplierList()
        await getEmbeddingModels()
        await get_model_list()
    } catch (error) {
        sendLog(error as Error)
    }
}

/**
 * @description 删除模型
 */
export async function removeSupplierModel(modelName: string) {
    const { currentChooseApi, } = getThirdPartyApiStoreData()
    try {
        await post("/model/remove_models", {
            supplierName: currentChooseApi.value?.supplierName,
            modelName
        })
    } catch (error) {
        sendLog(error as Error)
    }
}

/**
 * @description 设置单个模型状态
 */
export async function setModelStatus(modelName: string, status: string) {
    const { currentChooseApi } = getThirdPartyApiStoreData()
    try {
        await post("/model/set_model_status", {
            supplierName: currentChooseApi.value?.supplierName,
            modelName,
            status
        })
        await getEmbeddingModels()
        await get_model_list()
    } catch (error) {
        sendLog(error as Error)
    }
}

/**
 * @description 保存服务商配置
 */
export async function setSupplierConfig() {
    const { applierServiceConfig, currentChooseApi } = getThirdPartyApiStoreData()
    try {
        await post("/model/set_supplier_config", { ...applierServiceConfig.value, supplierName: currentChooseApi.value?.supplierName })
        await get_model_list()
    } catch (error) {
        sendLog(error as Error)
    }
}

/**
 * @description 设置供应商状态
 */
export async function setSupplierStatus(supplierName: string, status: boolean) {
    try {
        await post("/model/set_supplier_status", { supplierName, status: String(status) })
        if (status) {
            message.success($t("已启用模型该服务商"))
        } else {
            message.success($t("已禁用模型该服务商"))
        }
        await getEmbeddingModels()
        await get_model_list()
    } catch (error) {
        sendLog(error as Error)
    }
}

/**
 * @description 切换供应商状态
 */
export function changeCurrentSupplierStatus(supplierName: string, newStatus: boolean) {
    setSupplierStatus(supplierName, newStatus)
}

/**
 * @description 跳转到模型帮助官网
 */
export function jumpToHelp(url: string) {
    window.open(url)
}

/**
 * @description 修改模型数据
 */
export function handleModelDataChange(row: AddThirdPartySupplierMode) {
    const { addSupplierModel, isEditModelFormData, addModelFormData } = getThirdPartyApiStoreData();
    isEditModelFormData.value = true;
    addSupplierModel.value = true;
    addModelFormData.value = JSON.parse(JSON.stringify(row));
}

/**
 * @description 删除服务商弹窗
 */
export async function delSupplier(supplierName: string) {
    const { deleteSupplierShow } = getThirdPartyApiStoreData()
    deleteSupplierShow.value = true
}

/**
 * @description 取消删除服务商
 */
export function cancelDelSupplier() {
    const { deleteSupplierShow } = getThirdPartyApiStoreData()
    deleteSupplierShow.value = false
}

/**
 * @description 确认删除模型服务商
 */
export async function confirmDelSupplier() {
    const { currentSupplierName, deleteSupplierShow } = getThirdPartyApiStoreData()
    await removeSupplier(currentSupplierName.value);
    message.success($t('删除成功'));
    deleteSupplierShow.value = false;
    getSupplierList()
}

/**
 * @description 确认添加模型服务商
 */
export async function confirmAddSupplier() {
    const { addSupplierFormData, addSupplierShow, addSupplierForm, isEditModelFormData } = getThirdPartyApiStoreData();
    await addSupplierForm.value.validate()
    await addSupplier();
    message.success(isEditModelFormData.value ? $t('保存成功') : $t('添加成功'));
    addSupplierFormData.value = {
        supplierName: "",
        apiKey: "",
        baseUrl: "",
        supplierTitle: ""
    }
    addSupplierShow.value = false
    getSupplierList()
}

/**
 * @description 取消添加模型服务商
 */
export async function cancelAddSupplier() {
    const { addSupplierFormData, addSupplierShow } = getThirdPartyApiStoreData()
    addSupplierShow.value = false
    addSupplierFormData.value = {
        supplierName: "",
        apiKey: "",
        baseUrl: "",
        supplierTitle: ""
    }
}

/**
 * @description 批量设置模型状态
 */
export async function multipleModelStatusChange(val: boolean) {
    const { supplierModelList, currentChooseApi } = getThirdPartyApiStoreData()
    const multipleModelNames = supplierModelList.value.map((item: any) => item.modelName)
    await setModelStatus(multipleModelNames.join(","), String(val))
    if (val) {
        message.success($t("已启用全部模型"))
    } else {
        message.success($t("已禁用全部模型"))
    }
    getSupplierModelList(currentChooseApi.value!.supplierName)
}

/**
 * @description 模型状态切换
 */
export async function modelStatusChange(modelName: string, val: boolean) {
    const { currentChooseApi } = getThirdPartyApiStoreData()
    await setModelStatus(modelName, String(val))
    if (val) {
        message.success($t("模型启用成功"))
    } else {
        message.success($t("模型禁用成功"))
    }
    getSupplierModelList(currentChooseApi.value!.supplierName)
    get_model_list()
}


/***
 * @description 获取密钥
 */
export async function getKey(url: string) {
    window.open(url)
}

/**
 * @description 检查配置是否正确
 */
export async function checkConfig() {
    const { applierServiceConfig } = getThirdPartyApiStoreData()
    if (!applierServiceConfig.value.apiKey) {
        message.error($t("缺少API密钥"))
        return
    } else if (!applierServiceConfig.value.baseUrl) {
        message.error($t("缺少API地址"))
        return
    }
    const msg = await checkSupplierConfig()
    message.info(msg!)
}

/**
 * @description 保存服务商配置
 */
export async function saveConfig() {
    const { applierServiceConfig, currentChooseApi } = getThirdPartyApiStoreData()
    if (!applierServiceConfig.value.apiKey || !applierServiceConfig.value.baseUrl) {
        message.error($t("请填写完整配置信息"))
        return
    }
    await setSupplierConfig()
    message.success($t("配置保存成功"))
    currentChooseApi.value!.status = true
    getSupplierModelList(currentChooseApi.value!.supplierName)
}

/**
 * @description 删除模型
 */
export async function delModel(modelName: string) {
    const { deleteModelName, deleteModelShow } = getThirdPartyApiStoreData()
    deleteModelName.value = modelName
    deleteModelShow.value = true
}

/**
 * @description 取消删除模型
 */
export function cancelDelModel() {
    const { deleteModelShow } = getThirdPartyApiStoreData()
    deleteModelShow.value = false
}

/***
 * @description 确认删除模型
 */
export async function confirmDelModel() {
    const { deleteModelName, currentChooseApi } = getThirdPartyApiStoreData()
    await removeSupplierModel(deleteModelName.value);
    message.success($t('模型删除成功'));
    getSupplierModelList(currentChooseApi.value!.supplierName);
    cancelDelModel()
}

/**
 * @description 模型功能下拉值改变
 */
export async function capabilityChange(val: string[]) {
    const { addModelFormData, cantChoose } = getThirdPartyApiStoreData()
    if (val.includes("embedding")) {
        addModelFormData.value.capability = ["embedding"]
        cantChoose.value = true
    } else {
        addModelFormData.value.capability = val
        cantChoose.value = false
    }
}

/**
 * @description 确认添加模型
 */
export async function confirmAddModel() {
    const { addModelForm, addSupplierModel, addModelFormData, currentChooseApi, cantChoose, isEditModelFormData } = getThirdPartyApiStoreData();
    await addModelForm.value.validate()
    if (isEditModelFormData.value) {
        await editModels();
    } else {
        await addModels();
    }
    getSupplierModelList(currentChooseApi.value!.supplierName)
    addSupplierModel.value = false
    message.success($t("模型添加成功"))
    cantChoose.value = false
    addModelFormData.value = {
        modelName: "",
        capability: [],
        title: ""
    }
}

/**
 * @description 模型id改变的回调
 */
export async function modelIdChange(val: string) {
    const { addModelFormData } = getThirdPartyApiStoreData()
    addModelFormData.value.title = val
    addModelFormData.value.modelName = val
}

/**
 * @description 关闭添加模型弹窗
 */
export async function closeAddModel() {
    const { addSupplierModel, addModelFormData, isEditModelFormData } = getThirdPartyApiStoreData();
    addSupplierModel.value = false
    addModelFormData.value = {
        modelName: "",
        capability: [],
        title: ""
    }
    isEditModelFormData.value = false
}


/**
 * @description 点击选中api服务商
 */
export async function chooseApiService(item: ThirdPartyApiServiceItem) {
    const { currentChooseApi } = getThirdPartyApiStoreData()
    currentChooseApi.value = item
    await getSupplierModelList(item.supplierName)
    await getSupplierConfig(item)
}