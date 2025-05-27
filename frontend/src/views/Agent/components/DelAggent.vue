<template>
    <n-modal :mask-closable="false" :close-on-esc="false" :closable="false" :title="$t('提示')" preset="card"
        class="w-480px" v-model:show="delAgentShow">
        <span class="flex justify-start items-center mt-20">
            <i class="i-jam:alert-f w-24 h-24 text-[#E6A23C]"></i>
            {{ $t("是否确认删除智能体[{0}]?删除后无法恢复", [agentForDel!.agent_title]) }}
        </span>
        <template #footer>
            <div class="modal-footer-btns">
                <n-button @click="cancelDelAgent">{{ $t("取消") }}</n-button>
                <n-button @click="confirmDelAgent">{{ $t("确认") }}</n-button>
            </div>
        </template>
    </n-modal>
</template>

<script setup lang="ts">
import {
    cancelDelAgent,
    confirmDelAgent
} from "../controller"
import { getAgentStoreData } from '../store';
import { useI18n } from 'vue-i18n';
const {
    agentForDel,
    delAgentShow,
} = getAgentStoreData();
const { t: $t } = useI18n();
</script>

<style scoped></style>