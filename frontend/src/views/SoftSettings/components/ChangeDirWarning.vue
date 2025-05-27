<template>
    <n-modal :close-on-esc="false" :mask-closable="false" :closable="false" :title="$t('提示')"
        v-model:show="changeDataPathShow" preset="card" class="w-500">
        <span>{{ $t('切换目录会将旧目录数据迁移到新目录,视数据大小可能需要5-10分钟，迁移过程中请勿关闭软件') }}</span>
        <template #footer>
            <div class="modal-footer-btns">
                <n-button @click="cancelChangeDataSavePath">{{ $t("取消") }}</n-button>
                <n-button type="warning" @click="confirmChangeDataSavePath">{{ $t("选择新位置") }}</n-button>
            </div>
        </template>
    </n-modal>
</template>

<script setup lang="ts">
import {cancelChangeDataSavePath,confirmChangeDataSavePath} from "../controller"
import { getSoftSettingsStoreData } from '../store';
import { useI18n } from 'vue-i18n';
const { t: $t } = useI18n();
const { changeDataPathShow } = getSoftSettingsStoreData()
</script>

<style scoped></style>