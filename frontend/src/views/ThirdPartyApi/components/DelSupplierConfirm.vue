<template>
    <n-modal preset="card" :close-on-esc="false" :mask-closable="false" :closable="false" class="w-400"
        v-model:show="deleteSupplierShow" :title="$t('提示')">
        <span>{{ $t('是否删除当前服务商? 该操作会同时删除下属所有模型，请谨慎操作！') }}</span>

        <template #footer>
            <div class="modal-footer-btns">
                <n-button @click="cancelDelSupplier">{{ $t("取消") }}</n-button>
                <n-button type="warning" @click="confirmDelSupplier">{{ $t("确认") }}</n-button>
            </div>
        </template>
    </n-modal>
</template>

<script setup lang="ts">
import { cancelDelSupplier, confirmDelSupplier } from "../controller"
import { useI18n } from 'vue-i18n';
import { getThirdPartyApiStoreData } from '../store';
const { t: $t } = useI18n();
const { deleteSupplierShow } = getThirdPartyApiStoreData()
</script>

<style scoped></style>