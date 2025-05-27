<template>
	<n-modal :show="agentShow" preset="card" :title="$t('智能体')" style="width: 740px" :show-icon="false" @close="closeAgent">
		<template #close>
			<i class="i-tdesign:close-circle w-20 h-20 cursor-pointer text-[#909399]" @click="agentShow = false"></i>
		</template>
		<div class="agent-wrapper">
			<n-button type="primary" ghost class="mb-10" @click="createAgentShow = true">
				<template #icon>
					<i class="i-tdesign:add-circle"></i>
				</template>
				{{ $t('创建智能体') }}
			</n-button>
			<n-divider style="margin-top: 10px; margin-bottom: 10px" />
			<n-tabs>
				<n-tab-pane :tab="$t('我的智能体')" name="my-agent">
					<n-scrollbar class="max-h-300px">
						<MyAgent />
					</n-scrollbar>
				</n-tab-pane>
			</n-tabs>
			<n-divider style="margin-top: 10px; margin-bottom: 10px" />
			<n-tabs>
				<n-tab-pane :tab="$t('预设模板')" name="my-agent">
					<n-scrollbar class="max-h-300px">
						<PresetAgent />
					</n-scrollbar>
				</n-tab-pane>
			</n-tabs>
		</div>
	</n-modal>

	<!-- 创建智能体 -->
	<CreateAgent />

	<!-- 删除智能体 -->
	<DelAggent />
</template>

<script setup lang="ts">
import DelAggent from './components/DelAggent.vue';
import MyAgent from './components/MyAgent.vue';
import PresetAgent from './components/PresetAgent.vue';
import CreateAgent from '@/views/Agent/components/CreateAgent.vue';
import { getAgentStoreData } from './store';
import { useI18n } from 'vue-i18n';
import { getAgentList,closeAgent } from '@/views/Agent/controller';
const { t: $t } = useI18n();

const { agentShow, createAgentShow } = getAgentStoreData();

// 获取智能体列表
getAgentList();
</script>

<style scoped lang="scss">
@use '@/assets/base';

.agent-wrapper {
	.agent-card {
		cursor: pointer;
		@include base.row-flex-between;
		justify-content: start;
		align-items: center;

		@mixin span-style {
			display: inline-block;
			height: 36px;
			line-height: 36px;
		}

		.emoji-span {
			background: base.$gray-3;
			text-align: center;
			font-size: 24px;
			border-radius: 50%;
			@include span-style();
		}

		.text {
			@include span-style();
		}
	}
}

:deep(.n-card__content) {
	padding: 8px !important;
}
</style>
