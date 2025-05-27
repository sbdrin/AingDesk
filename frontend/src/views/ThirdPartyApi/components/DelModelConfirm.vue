<template>
    <n-modal preset="card" :close-on-esc="false" :mask-closable="false" :closable="false" class="w-400"
        v-model:show="deleteModelShow" :title="$t('提示')" >
        <span>{{ $t('是否确定删除当前模型？该操作不可逆') }}</span>

        <template #footer>
            <div class="modal-footer-btns">
                <n-button @click="cancelDelModel">{{ $t("取消") }}</n-button>
                <n-button type="warning" @click="confirmDelModel">{{ $t("确认") }}</n-button>
            </div>
        </template>
    </n-modal>
</template>

<script setup lang="ts">
import { cancelDelModel, confirmDelModel } from "../controller"
import { useI18n } from 'vue-i18n';
import { getThirdPartyApiStoreData } from '../store';
const { t: $t } = useI18n();
const { deleteModelShow } = getThirdPartyApiStoreData()
</script>

<style scoped></style>