<template>
    <n-modal :close-on-esc="false" :mask-closable="false" preset="card" v-model:show="delMcpConfirmShow"
        :title="$t('提示')" class="w-400" :closable="false">
        <span>{{ $t('是否删除当前MCP服务器？') }}</span>
        <template #footer>
            <div class="modal-footer-btns">
                <n-button @click="cancelDeleteMcpServer">{{ $t("取消") }}</n-button>
                <n-button type="warning" @click="confirmDeleteMcpServer">{{ $t("确认") }}</n-button>
            </div>
        </template>
    </n-modal>
</template>

<script setup lang="ts">
import { cancelDeleteMcpServer, confirmDeleteMcpServer } from "../controller"
import { getSoftSettingsStoreData } from '../store';
const { delMcpConfirmShow } = getSoftSettingsStoreData()
</script>

<style scoped></style>