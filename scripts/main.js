// 轻量“会话仓库”与状态机（原型演示，不接后端）
const conversationStore = {
    list: [], // {id, title, createdAt, status, inputText, images}
    currentId: null
};

function createConversation(payload) {
    const id = 'C' + Date.now();
    const conv = {
        id,
        title: payload.title || 'AI诊断',
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        status: 'queued', // queued -> running -> done/failed
        inputText: payload.inputText || '',
        images: payload.images || []
    };
    conversationStore.list.unshift(conv);
    conversationStore.currentId = id;
    return conv;
}

function getConversation(id) {
    return conversationStore.list.find(c => c.id === id);
}

function setConversationStatus(id, status) {
    const c = getConversation(id);
    if (c) c.status = status;
}

// 页面数据
const pageData = {
    home: {
        title: '首页',
        subtitle: '农业管理系统',
        content: `
            <div class="mobile-page workbench-page">
                <div class="mobile-header">
                    <h1>首页</h1>
                </div>
                <div class="mobile-content">
                    <!-- 组织卡片 -->
                    <div class="card org-card">
                        <div class="org-row">
                            <div class="org-name">
                                龙腾虎跃有限公司（壹）
                            </div>
                            <div class="org-actions">
                                <a class="org-switch" href="javascript:void(0)">切换组织 <i class="fas fa-arrow-right"></i></a>
                                <button class="header-message-btn" onclick="showMessages()" style="margin-left: 10px;">
                                    <i class="fas fa-bell"></i>
                                    <span class="message-badge">3</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 统计概览 -->
                    <div class="card stats-card">
                        <div class="wb-stats-grid">
                            <div class="wb-stat-item">
                                <div class="wb-stat-number">2亩</div>
                                <div class="wb-stat-label">管理规模</div>
                            </div>
                            <div class="wb-stat-item">
                                <div class="wb-stat-number">1个</div>
                                <div class="wb-stat-label">管理项目</div>
                            </div>
                            <div class="wb-stat-item">
                                <div class="wb-stat-number">1/1个</div>
                                <div class="wb-stat-label">管理基地/地块</div>
                            </div>
                            <div class="wb-stat-item">
                                <div class="wb-stat-number">2亩</div>
                                <div class="wb-stat-label">当前播种</div>
                            </div>
                            <div class="wb-stat-item">
                                <div class="wb-stat-number">0种</div>
                                <div class="wb-stat-label">种养品种</div>
                            </div>
                            <div class="wb-stat-item">
                                <div class="wb-stat-number">0个</div>
                                <div class="wb-stat-label">物联网设备</div>
                            </div>
                        </div>
                    </div>

                    <!-- 当前生产主体 -->
                    <div class="card subject-card">
                        <div class="subject-row">
                            <div class="subject-title">当前生产主体</div>
                            <a class="subject-switch" href="javascript:void(0)">切换 <i class="fas fa-arrow-right"></i></a>
                        </div>
                        <div class="subject-desc">大厅水培植物 | 一号分区</div>
                    </div>
                    
                    <!-- AI病虫害诊断卡片 -->
                    <div class="card ai-diagnosis-card">
                        <div class="ai-card-header">
                            <div class="ai-card-title">
                                <i class="fas fa-robot"></i>
                                <span>AI病虫害诊断</span>
                            </div>
                            <div class="ai-card-subtitle">智能识别 · 专家建议 · 精准防治</div>
                        </div>
                        
                        <div class="ai-card-content">
                            <div class="ai-description">
                                云农谷AI有强大的图片分析能力，帮您识别病虫害出防治方案，支持拍照识别，图片+文字同时提问。
                            </div>
                            
                            <!-- 组合式输入区域 - 图片上传嵌入文本输入框 -->
                            <div class="combined-input-container">
                                <textarea 
                                    id="inlineQuestionTextarea" 
                                    class="combined-textarea" 
                                    placeholder="告诉我您的问题吧～"
                                    rows="3"
                                ></textarea>
                                
                                <!-- 内嵌图片上传区域 -->
                                <div class="embedded-upload-area">
                                    <div class="embedded-upload-trigger" id="embeddedUploadTrigger">
                                        <i class="fas fa-image"></i>
                                        <span>添加图片</span>
                                    </div>
                                    <div class="embedded-image-preview" id="embeddedImagePreview">
                                        <!-- 内嵌图片预览 -->
                                    </div>
                                </div>
                                <input type="file" id="embeddedImageInput" accept="image/*" style="display: none;" multiple>
                            </div>
                            
                            <!-- AI诊断按钮 -->
                            <div class="ai-card-actions">
                                <button class="btn-start-ai-diagnosis" id="btnStartDiagnosis" onclick="startInlineDiagnosis()">
                                    <i class="fas fa-brain"></i>
                                    <span>开始AI诊断</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 数字大田功能入口 -->
                    <div class="card">
                        <div class="section-title">数字大田</div>
                        <div class="feature-grid">
                            <div class="feature-item clickable" onclick="loadPage('plantingPlan')"><div class="fi-icon"><i class="fas fa-seedling"></i></div><div class="fi-text">种植计划</div></div>
                            <div class="feature-item clickable" onclick="loadPage('farmCalendar')"><div class="fi-icon"><i class="fas fa-calendar-alt"></i></div><div class="fi-text">农事日历</div></div>
                            <div class="feature-item"><div class="fi-icon"><i class="fas fa-bug"></i></div><div class="fi-text">病虫害识别</div></div>
                            <div class="feature-item"><div class="fi-icon"><i class="fas fa-user-md"></i></div><div class="fi-text">专家诊断</div></div>
                            <div class="feature-item"><div class="fi-icon"><i class="fas fa-warehouse"></i></div><div class="fi-text">投入品管理</div></div>
                            <div class="feature-item"><div class="fi-icon"><i class="fas fa-file-signature"></i></div><div class="fi-text">投入品申请</div></div>
                            <div class="feature-item"><div class="fi-icon"><i class="fas fa-people-carry"></i></div><div class="fi-text">临时工申请</div></div>
                            <div class="feature-item"><div class="fi-icon"><i class="fas fa-stamp"></i></div><div class="fi-text">农事审批</div></div>
                            <div class="feature-item"><div class="fi-icon"><i class="fas fa-receipt"></i></div><div class="fi-text">我的领用</div></div>
                            <div class="feature-item"><div class="fi-icon"><i class="fas fa-tractor"></i></div><div class="fi-text">农机管理</div></div>
                            <div class="feature-item clickable" onclick="loadPage('fieldWorkstation')"><div class="fi-icon"><i class="fas fa-microchip"></i></div><div class="fi-text">田间工作站</div></div>
                            <div class="feature-item disabled"><div class="fi-icon"><i class="fas fa-ellipsis-h"></i></div><div class="fi-text">更多</div></div>
                        </div>
                    </div>
                </div>

                <!-- 底部导航 -->
                <div class="mobile-footer tabbar">
                    <div class="tab-item active" data-page="home"><i class="fas fa-home"></i><span>首页</span></div>
                    <div class="tab-item" data-page="mall"><i class="fas fa-store"></i><span>商城</span></div>
                    <div class="tab-item" data-page="ai"><i class="fas fa-robot"></i><span>AI</span></div>
                    <div class="tab-item" data-page="workbench"><i class="fas fa-briefcase"></i><span>工作台</span></div>
                    <div class="tab-item" data-page="profile"><i class="fas fa-user"></i><span>我的</span></div>
                </div>
            </div>
        `
    },
    
    // AI中心 - 中：AI对话（默认页）
    aiChatCenter: {
        title: 'AI对话',
        subtitle: '统一AI交互中心',
        content: `
            <div class="mobile-page ai-center-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="loadPage('home')">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h1>AI对话</h1>
                </div>
                <div class="mobile-content">
                    <!-- 历史记录按钮 -->
                    <div class="history-btn-container">
                        <button class="history-btn" onclick="showComingSoon('与现有功能保持一致')">
                            <i class="fas fa-history"></i>
                        </button>
                    </div>
                    <!-- AI Logo 和欢迎文字 -->
                    <div class="ai-welcome-section">
                        <div class="ai-logo">
                            <i class="fas fa-seedling"></i>
                        </div>
                        <p class="ai-greeting">您好，我是小跃，是您身边基于云农谷自研大模型的AI农业专家，您可以问我任何有关农业领域的问题......</p>
                        <button class="examples-btn" onclick="showExamplesModal()">
                            <i class="fas fa-lightbulb"></i>
                            <span>例子</span>
                        </button>
                    </div>

                    <!-- 输入区域 -->
                    <div class="ai-input-section">
                        <div class="ai-input-container">
                            <textarea id="aiCenterInput" class="ai-textarea" placeholder="输入您的问题，例如：这张叶片是什么病？" rows="5"></textarea>
                            <div class="ai-input-actions">
                                <button class="voice-btn" onclick="showComingSoon('语音录入')">
                                    <i class="fas fa-microphone"></i>
                                </button>
                                <button class="camera-btn" onclick="document.getElementById('aiCenterImage').click()">
                                    <i class="fas fa-camera"></i>
                                </button>
                                <button class="send-btn" onclick="startAICenterChat()">
                                    <i class="fas fa-arrow-right"></i>
                                </button>
                            </div>
                            <input type="file" id="aiCenterImage" accept="image/*" multiple style="display:none" onchange="previewAICenterImages(this)">
                        </div>
                        <div id="aiCenterImagePreview" class="image-preview"></div>
                    </div>

                    <!-- 推荐智能体 -->
                    <div class="recommended-agents">
                        <div class="agents-hint">快速访问</div>
                        <div class="agents-grid">
                            <div class="agent-card" onclick="loadAgentChatPage('pest-diagnosis', '病虫害诊断')">
                                <i class="fas fa-bug"></i>
                                <span>病虫害诊断</span>
                            </div>
                            <div class="agent-card" onclick="loadAgentChatPage('weed-control-analysis', '除草成效分析')">
                                <i class="fas fa-spray-can"></i>
                                <span>除草成效分析</span>
                            </div>
                            <div class="agent-card" onclick="loadAgentChatPage('crop-model-brain', '农作物模型大脑')">
                                <i class="fas fa-brain"></i>
                                <span>农作物模型大脑</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- AI中心内嵌三段式导航 -->
                <div class="mobile-footer ai-center-tabbar">
                    <div class="tab-item" data-ai-tab="agentMarket" onclick="loadPage('agentMarket')"><i class="fas fa-th-large"></i><span>智能体广场</span></div>
                    <div class="tab-item active" data-ai-tab="aiChatCenter" onclick="loadPage('aiChatCenter')"><i class="fas fa-comments"></i><span>AI对话</span></div>
                    <div class="tab-item" data-ai-tab="mySubscriptions" onclick="loadPage('mySubscriptions')"><i class="fas fa-star"></i><span>我的订阅</span></div>
                </div>

                <!-- 例子弹窗 -->
                <div id="examplesModal" class="examples-modal">
                    <div class="modal-overlay" onclick="hideExamplesModal()"></div>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>常见问题示例</h3>
                            <button class="close-btn" onclick="hideExamplesModal()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="example-item" onclick="selectExample('如何防治小麦赤霉病？')">
                                <div class="example-title">病虫害防治</div>
                                <div class="example-desc">如何防治小麦赤霉病？</div>
                            </div>
                            <div class="example-item" onclick="selectExample('玉米施肥的最佳时间是什么时候？')">
                                <div class="example-title">施肥管理</div>
                                <div class="example-desc">玉米施肥的最佳时间是什么时候？</div>
                            </div>
                            <div class="example-item" onclick="selectExample('如何提高水稻产量？')">
                                <div class="example-title">产量提升</div>
                                <div class="example-desc">如何提高水稻产量？</div>
                            </div>
                            <div class="example-item" onclick="selectExample('最近的天气对作物有什么影响？')">
                                <div class="example-title">气象影响</div>
                                <div class="example-desc">最近的天气对作物有什么影响？</div>
                            </div>
                            <div class="example-item" onclick="selectExample('什么是数字大田？')">
                                <div class="example-title">数字农业</div>
                                <div class="example-desc">什么是数字大田？</div>
                            </div>
                            <div class="example-item" onclick="selectExample('如何进行土壤检测？')">
                                <div class="example-title">土壤管理</div>
                                <div class="example-desc">如何进行土壤检测？</div>
                            </div>
                            <div class="example-item" onclick="selectExample('如何选择适合的种子？')">
                                <div class="example-title">种子选择</div>
                                <div class="example-desc">如何选择适合的种子？</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },

    // 新增：病虫害识别页面
    pestDetect: {
        title: '病虫害识别',
        subtitle: '拍照或描述，AI识别病虫害',
        content: `
            <div class="mobile-page ai-center-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="loadPage('aiChatCenter')">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h1>病虫害识别</h1>
                </div>
                <div class="mobile-content">
                    <!-- 顶部说明 -->
                    <div class="ai-welcome-section">
                        <div class="ai-logo">
                            <i class="fas fa-bug"></i>
                        </div>
                        <p class="ai-greeting">上传或拍摄病叶/虫体照片，或用文字描述症状，我来帮您识别并给出治理建议。</p>
                        <button class="examples-btn" onclick="showExamplesModal()">
                            <i class="fas fa-lightbulb"></i>
                            <span>例子</span>
                        </button>
                    </div>

                    <!-- 输入区域（复用AI中心的ID，避免新增JS） -->
                    <div class="ai-input-section">
                        <div class="ai-input-container">
                            <textarea id="aiCenterInput" class="ai-textarea" placeholder="例如：这张叶片有黄褐色斑点，请问是什么病？" rows="5"></textarea>
                            <div class="ai-input-actions">
                                <button class="voice-btn" onclick="showComingSoon('语音录入')">
                                    <i class="fas fa-microphone"></i>
                                </button>
                                <button class="camera-btn" onclick="document.getElementById('aiCenterImage').click()">
                                    <i class="fas fa-camera"></i>
                                </button>
                                <button class="send-btn" onclick="startAICenterChat()">
                                    <i class="fas fa-arrow-right"></i>
                                </button>
                            </div>
                            <input type="file" id="aiCenterImage" accept="image/*" multiple style="display:none" onchange="previewAICenterImages(this)">
                        </div>
                        <div id="aiCenterImagePreview" class="image-preview"></div>
                    </div>

                    <!-- 例子弹窗（复用通用结构与JS） -->
                    <div id="examplesModal" class="examples-modal">
                        <div class="modal-overlay" onclick="hideExamplesModal()"></div>
                        <div class="modal-content">
                            <div class="modal-header">
                                <h3>常见识别示例</h3>
                                <button class="close-btn" onclick="hideExamplesModal()">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="example-item" onclick="selectExample('这张叶片是否为玉米大斑病？')">
                                    <div class="example-title">图片识别</div>
                                    <div class="example-desc">这张叶片是否为玉米大斑病？</div>
                                </div>
                                <div class="example-item" onclick="selectExample('小麦叶片出现条状黄化是什么原因？')">
                                    <div class="example-title">症状描述</div>
                                    <div class="example-desc">小麦叶片出现条状黄化是什么原因？</div>
                                </div>
                                <div class="example-item" onclick="selectExample('番茄叶背有白色小虫如何治理？')">
                                    <div class="example-title">虫害识别</div>
                                    <div class="example-desc">番茄叶背有白色小虫如何治理？</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 保持AI三段式（仅显示三项，无底部五项导航） -->
                <div class="mobile-footer ai-center-tabbar">
                    <div class="tab-item" data-ai-tab="agentMarket" onclick="loadPage('agentMarket')"><i class="fas fa-th-large"></i><span>智能体广场</span></div>
                    <div class="tab-item active" data-ai-tab="aiChatCenter" onclick="loadPage('pestDetect')"><i class="fas fa-bug"></i><span>病虫害识别</span></div>
                    <div class="tab-item" data-ai-tab="mySubscriptions" onclick="loadPage('mySubscriptions')"><i class="fas fa-star"></i><span>我的订阅</span></div>
                </div>
            </div>
        `
    },

    // AI中心 - 左：智能体广场
    agentMarket: {
        title: '智能体广场',
        subtitle: '发现与订阅',
        content: `
            <div class="mobile-page agent-market-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="loadPage('aiChatCenter')">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h1>智能体广场</h1>
                </div>
                <div class="mobile-content">
                    <div class="search-bar"><i class="fas fa-search"></i><input type="text" placeholder="搜索智能体，如 病虫害、产量" oninput="showComingSoon('搜索')"></div>

                    <!-- 分类卡片：农事管理 -->
                    <div class="category-section">
                        <div class="category-title">农事管理</div>
                        <div class="agent-cards-grid">
                            <div class="agent-card-detailed" data-agent-id="digital-farmland" data-category="农事管理" data-type="platform" data-price="free" onclick="handleAgentCardClick(event, 'digital-farmland', 'free')">
                                <div class="agent-icon"><i class="fas fa-seedling"></i></div>
                                <div class="agent-info">
                                    <div class="agent-name">数字大田</div>
                                    <div class="agent-desc">智能农田管理，精准农事指导</div>
                                    <div class="agent-tags">
                                        <span class="tag platform-tag">平台官方</span>
                                    </div>
                                </div>
                                <div class="agent-actions">
                                    <div class="agent-price free">免费</div>
                                    <button class="subscribe-btn" onclick="event.stopPropagation(); subscribeAgent('digital-farmland', 'free');">订阅</button>
                                </div>
                            </div>
                            <div class="agent-card-detailed" data-agent-id="statistical-analysis" data-category="农事管理" data-type="platform" data-price="free" onclick="handleAgentCardClick(event, 'statistical-analysis', 'free')">
                                <div class="agent-icon"><i class="fas fa-chart-pie"></i></div>
                                <div class="agent-info">
                                    <div class="agent-name">统计分析</div>
                                    <div class="agent-desc">农事数据统计分析，决策支持</div>
                                    <div class="agent-tags">
                                        <span class="tag platform-tag">平台官方</span>
                                    </div>
                                </div>
                                <div class="agent-actions">
                                    <div class="agent-price free">免费</div>
                                    <button class="subscribe-btn" onclick="event.stopPropagation(); subscribeAgent('statistical-analysis', 'free')">订阅</button>
                                </div>
                            </div>
                            <div class="agent-card-detailed" data-agent-id="weed-control-analysis" data-category="农事管理" data-type="platform" data-price="free" onclick="handleAgentCardClick(event, 'weed-control-analysis', 'free')">
                                <div class="agent-icon"><i class="fas fa-spray-can"></i></div>
                                <div class="agent-info">
                                    <div class="agent-name">除草成效分析</div>
                                    <div class="agent-desc">智能分析除草效果，优化方案</div>
                                    <div class="agent-tags">
                                        <span class="tag platform-tag">平台官方</span>
                                    </div>
                                </div>
                                <div class="agent-actions">
                                    <div class="agent-price free">免费</div>
                                    <button class="subscribe-btn" onclick="event.stopPropagation(); subscribeAgent('weed-control-analysis', 'free')">订阅</button>
                                </div>
                            </div>
                            <div class="agent-card-detailed" data-agent-id="plan-assistant" data-category="农事管理" data-type="expert" data-expert="张惠农" data-price="paid" onclick="handleAgentCardClick(event, 'plan-assistant', 'paid')">
                                <div class="agent-icon"><i class="fas fa-calendar-alt"></i></div>
                                <div class="agent-info">
                                    <div class="agent-name">生产计划助手</div>
                                    <div class="agent-desc">智能制定农事计划</div>
                                    <div class="agent-tags">
                                        <span class="tag expert-tag">张惠农</span>
                                    </div>
                                </div>
                                <div class="agent-actions">
                                    <div class="agent-price paid">¥29/月</div>
                                    <button class="subscribe-btn" onclick="event.stopPropagation(); subscribeAgent('plan-assistant', 'paid')">订阅</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 分类卡片：病虫害防治 -->
                    <div class="category-section">
                        <div class="category-title">病虫害防治</div>
                        <div class="agent-cards-grid">
                            <div class="agent-card-detailed" data-agent-id="pest-diagnosis" data-category="病虫害防治" data-type="platform" data-price="free">
                                <div class="agent-icon"><i class="fas fa-bug"></i></div>
                                <div class="agent-info">
                                    <div class="agent-name">病虫害诊断</div>
                                    <div class="agent-desc">AI智能识别病虫害，精准诊断</div>
                                    <div class="agent-tags">
                                        <span class="tag platform-tag">平台官方</span>
                                    </div>
                                </div>
                                <div class="agent-actions">
                                    <div class="agent-price free">免费</div>
                                    <button class="subscribe-btn" onclick="event.stopPropagation(); subscribeAgent('pest-diagnosis', 'free')">订阅</button>
                                </div>
                            </div>
                            <div class="agent-card-detailed" data-agent-id="pesticide-advisor" data-category="病虫害防治" data-type="expert" data-expert="李植保" data-price="paid">
                                <div class="agent-icon"><i class="fas fa-pills"></i></div>
                                <div class="agent-info">
                                    <div class="agent-name">用药建议</div>
                                    <div class="agent-desc">精准用药指导，科学防治</div>
                                    <div class="agent-tags">
                                        <span class="tag expert-tag">李植保</span>
                                    </div>
                                </div>
                                <div class="agent-actions">
                                    <div class="agent-price paid">¥39/月</div>
                                    <button class="subscribe-btn" onclick="event.stopPropagation(); subscribeAgent('pesticide-advisor', 'paid')">订阅</button>
                                </div>
                            </div>
                            <div class="agent-card-detailed" data-agent-id="expert-weekly" data-category="病虫害防治" data-type="expert" data-expert="王农技" data-price="paid">
                                <div class="agent-icon"><i class="fas fa-newspaper"></i></div>
                                <div class="agent-info">
                                    <div class="agent-name">专家周报</div>
                                    <div class="agent-desc">每周病虫害预警，及时防治</div>
                                    <div class="agent-tags">
                                        <span class="tag expert-tag">王农技</span>
                                    </div>
                                </div>
                                <div class="agent-actions">
                                    <div class="agent-price paid">¥19/月</div>
                                    <button class="subscribe-btn" onclick="event.stopPropagation(); subscribeAgent('expert-weekly', 'paid')">订阅</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 分类卡片：作物生长管理 -->
                    <div class="category-section">
                        <div class="category-title">作物生长管理</div>
                        <div class="agent-cards-grid">
                            <div class="agent-card-detailed" data-agent-id="crop-model-brain" data-category="作物生长管理" data-type="platform" data-price="free">
                                <div class="agent-icon"><i class="fas fa-brain"></i></div>
                                <div class="agent-info">
                                    <div class="agent-name">农作物模型大脑</div>
                                    <div class="agent-desc">智能作物生长模型，精准管理</div>
                                    <div class="agent-tags">
                                        <span class="tag platform-tag">平台官方</span>
                                    </div>
                                </div>
                                <div class="agent-actions">
                                    <div class="agent-price free">免费</div>
                                    <button class="subscribe-btn" onclick="event.stopPropagation(); subscribeAgent('crop-model-brain', 'free')">订阅</button>
                                </div>
                            </div>
                            <div class="agent-card-detailed" data-agent-id="growth-stage" data-category="作物生长管理" data-type="expert" data-expert="陈农学" data-price="free">
                                <div class="agent-icon"><i class="fas fa-seedling"></i></div>
                                <div class="agent-info">
                                    <div class="agent-name">生育期识别</div>
                                    <div class="agent-desc">智能识别作物生长阶段</div>
                                    <div class="agent-tags">
                                        <span class="tag expert-tag">陈农学</span>
                                    </div>
                                </div>
                                <div class="agent-actions">
                                    <div class="agent-price free">免费</div>
                                    <button class="subscribe-btn" onclick="event.stopPropagation(); subscribeAgent('growth-stage', 'free')">订阅</button>
                                </div>
                            </div>
                            <div class="agent-card-detailed" data-agent-id="nutrition-advisor" data-category="作物生长管理" data-type="expert" data-expert="刘营养" data-price="paid">
                                <div class="agent-icon"><i class="fas fa-flask"></i></div>
                                <div class="agent-info">
                                    <div class="agent-name">营养诊断</div>
                                    <div class="agent-desc">精准营养分析，科学施肥</div>
                                    <div class="agent-tags">
                                        <span class="tag expert-tag">刘营养</span>
                                    </div>
                                </div>
                                <div class="agent-actions">
                                    <div class="agent-price paid">¥49/月</div>
                                    <button class="subscribe-btn" onclick="event.stopPropagation(); subscribeAgent('nutrition-advisor', 'paid')">订阅</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 分类卡片：销售服务 -->
                    <div class="category-section">
                        <div class="category-title">销售服务</div>
                        <div class="agent-cards-grid">
                            <div class="agent-card-detailed" data-agent-id="price-insight" data-category="销售服务" data-type="expert" data-expert="赵市场" data-price="free">
                                <div class="agent-icon"><i class="fas fa-chart-bar"></i></div>
                                <div class="agent-info">
                                    <div class="agent-name">价格洞察</div>
                                    <div class="agent-desc">市场行情分析，价格预测</div>
                                    <div class="agent-tags">
                                        <span class="tag expert-tag">赵市场</span>
                                    </div>
                                </div>
                                <div class="agent-actions">
                                    <div class="agent-price free">免费</div>
                                    <button class="subscribe-btn" onclick="event.stopPropagation(); subscribeAgent('price-insight', 'free')">订阅</button>
                                </div>
                            </div>
                            <div class="agent-card-detailed" data-agent-id="channel-match" data-category="销售服务" data-type="expert" data-expert="孙销售" data-price="paid">
                                <div class="agent-icon"><i class="fas fa-handshake"></i></div>
                                <div class="agent-info">
                                    <div class="agent-name">渠道匹配</div>
                                    <div class="agent-desc">智能匹配销售渠道</div>
                                    <div class="agent-tags">
                                        <span class="tag expert-tag">孙销售</span>
                                    </div>
                                </div>
                                <div class="agent-actions">
                                    <div class="agent-price paid">¥59/月</div>
                                    <button class="subscribe-btn" onclick="event.stopPropagation(); subscribeAgent('channel-match', 'paid')">订阅</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 分类卡片：选种服务 -->
                    <div class="category-section">
                        <div class="category-title">选种服务</div>
                        <div class="agent-cards-grid">
                            <div class="agent-card-detailed" data-agent-id="variety-select" data-category="选种服务" data-type="expert" data-expert="周育种" data-price="free">
                                <div class="agent-icon"><i class="fas fa-seedling"></i></div>
                                <div class="agent-info">
                                    <div class="agent-name">品种选择</div>
                                    <div class="agent-desc">智能推荐优质品种</div>
                                    <div class="agent-tags">
                                        <span class="tag expert-tag">周育种</span>
                                    </div>
                                </div>
                                <div class="agent-actions">
                                    <div class="agent-price free">免费</div>
                                    <button class="subscribe-btn" onclick="event.stopPropagation(); subscribeAgent('variety-select', 'free')">订阅</button>
                                </div>
                            </div>
                            <div class="agent-card-detailed" data-agent-id="seed-plan" data-category="选种服务" data-type="expert" data-expert="吴种植" data-price="paid">
                                <div class="agent-icon"><i class="fas fa-calendar-check"></i></div>
                                <div class="agent-info">
                                    <div class="agent-name">播种计划</div>
                                    <div class="agent-desc">科学制定播种方案</div>
                                    <div class="agent-tags">
                                        <span class="tag expert-tag">吴种植</span>
                                    </div>
                                </div>
                                <div class="agent-actions">
                                    <div class="agent-price paid">¥29/月</div>
                                    <button class="subscribe-btn" onclick="event.stopPropagation(); subscribeAgent('seed-plan', 'paid')">订阅</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 分类卡片：灾情预警 -->
                    <div class="category-section">
                        <div class="category-title">灾情预警</div>
                        <div class="agent-cards-grid">
                            <div class="agent-card-detailed" data-agent-id="risk-analysis" data-category="灾情预警" data-type="platform" data-price="free">
                                <div class="agent-icon"><i class="fas fa-exclamation-triangle"></i></div>
                                <div class="agent-info">
                                    <div class="agent-name">风险分析</div>
                                    <div class="agent-desc">智能分析农业风险，提前预警</div>
                                    <div class="agent-tags">
                                        <span class="tag platform-tag">平台官方</span>
                                    </div>
                                </div>
                                <div class="agent-actions">
                                    <div class="agent-price free">免费</div>
                                    <button class="subscribe-btn" onclick="event.stopPropagation(); subscribeAgent('risk-analysis', 'free')">订阅</button>
                                </div>
                            </div>
                            <div class="agent-card-detailed" data-agent-id="meteorology" data-category="灾情预警" data-type="expert" data-expert="郑气象" data-price="free">
                                <div class="agent-icon"><i class="fas fa-cloud-sun"></i></div>
                                <div class="agent-info">
                                    <div class="agent-name">气象监测</div>
                                    <div class="agent-desc">实时天气数据监测</div>
                                    <div class="agent-tags">
                                        <span class="tag expert-tag">郑气象</span>
                                    </div>
                                </div>
                                <div class="agent-actions">
                                    <div class="agent-price free">免费</div>
                                    <button class="subscribe-btn" onclick="event.stopPropagation(); subscribeAgent('meteorology', 'free')">订阅</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 分类卡片：其他 -->
                    <div class="category-section">
                        <div class="category-title">其他</div>
                        <div class="agent-cards-grid">
                            <div class="agent-card-detailed" data-agent-id="policy-advisor" data-category="其他" data-type="expert" data-expert="钱政策" data-price="free">
                                <div class="agent-icon"><i class="fas fa-book"></i></div>
                                <div class="agent-info">
                                    <div class="agent-name">政策咨询</div>
                                    <div class="agent-desc">农业政策解读指导</div>
                                    <div class="agent-tags">
                                        <span class="tag expert-tag">钱政策</span>
                                    </div>
                                </div>
                                <div class="agent-actions">
                                    <div class="agent-price free">免费</div>
                                    <button class="subscribe-btn" onclick="event.stopPropagation(); subscribeAgent('policy-advisor', 'free')">订阅</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mobile-footer ai-center-tabbar">
                    <div class="tab-item active" data-ai-tab="agentMarket" onclick="loadPage('agentMarket')"><i class="fas fa-th-large"></i><span>智能体广场</span></div>
                    <div class="tab-item" data-ai-tab="aiChatCenter" onclick="loadPage('aiChatCenter')"><i class="fas fa-comments"></i><span>AI对话</span></div>
                    <div class="tab-item" data-ai-tab="mySubscriptions" onclick="loadPage('mySubscriptions')"><i class="fas fa-star"></i><span>我的订阅</span></div>
                </div>
            </div>
        `
    },

    // AI中心 - 右：我的订阅
    mySubscriptions: {
        title: '我的订阅',
        subtitle: '已购智能体管理',
        content: `
            <div class="mobile-page my-subs-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="loadPage('aiChatCenter')">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h1>我的订阅</h1>
                    <button class="demo-toggle-btn" onclick="toggleSubscriptionDemo()" title="切换演示状态">
                        <i class="fas fa-toggle-on"></i>
                    </button>
                </div>
                <div class="mobile-content">
                    <!-- 未订阅状态 -->
                    <div class="empty-state" id="subsEmpty">
                        <div class="empty-icon"><i class="fas fa-box-open"></i></div>
                        <div class="empty-title">还没有订阅</div>
                        <div class="empty-sub">去智能体广场发现更多能力</div>
                        <div style="text-align:center; margin-top:8px;">
                            <button class="btn-secondary" onclick="loadPage('agentMarket')">去逛逛</button>
                        </div>
                    </div>

                    <!-- 已订阅状态 -->
                    <div class="subscription-content" id="subsContent" style="display:none">
                        <!-- 订阅统计 -->
                        <div class="subscription-stats">
                            <div class="stat-item">
                                <div class="stat-number">5</div>
                                <div class="stat-label">已订阅</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">3</div>
                                <div class="stat-label">免费</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">2</div>
                                <div class="stat-label">付费</div>
                            </div>
                        </div>

                        <!-- 订阅列表 -->
                        <div class="subscription-list">
                            <div class="list-section-title">我的智能体</div>
                            
                            <!-- 免费订阅 -->
                            <div class="subscription-item" onclick="loadPage('pestDetect')">
                                <div class="sub-icon"><i class="fas fa-bug"></i></div>
                                <div class="sub-info">
                                    <div class="sub-name">病虫害识别</div>
                                    <div class="sub-desc">AI智能识别病虫害</div>
                                    <div class="sub-status free">永久免费</div>
                                </div>
                                <div class="sub-action">
                                    <span class="action-btn">使用</span>
                                </div>
                            </div>

                            <div class="subscription-item" onclick="openAgentDetail('plan-assistant')">
                                <div class="sub-icon"><i class="fas fa-calendar-alt"></i></div>
                                <div class="sub-info">
                                    <div class="sub-name">生产计划助手</div>
                                    <div class="sub-desc">智能制定农事计划</div>
                                    <div class="sub-status free">永久免费</div>
                                </div>
                                <div class="sub-action">
                                    <span class="action-btn">使用</span>
                                </div>
                            </div>

                            <div class="subscription-item" onclick="openAgentDetail('growth-stage')">
                                <div class="sub-icon"><i class="fas fa-seedling"></i></div>
                                <div class="sub-info">
                                    <div class="sub-name">生育期识别</div>
                                    <div class="sub-desc">智能识别作物生长阶段</div>
                                    <div class="sub-status free">永久免费</div>
                                </div>
                                <div class="sub-action">
                                    <span class="action-btn">使用</span>
                                </div>
                            </div>

                            <!-- 付费订阅 -->
                            <div class="subscription-item">
                                <div class="sub-icon"><i class="fas fa-pills"></i></div>
                                <div class="sub-info">
                                    <div class="sub-name">用药建议</div>
                                    <div class="sub-desc">精准用药指导</div>
                                    <div class="sub-status paid">¥2/次 · 剩余15次</div>
                                </div>
                                <div class="sub-actions">
                                    <span class="action-btn primary" onclick="openAgentDetail('pesticide-advisor')">使用</span>
                                    <span class="action-btn secondary" onclick="showRenewalModal('pesticide-advisor')">续费</span>
                                </div>
                            </div>

                            <div class="subscription-item">
                                <div class="sub-icon"><i class="fas fa-chart-line"></i></div>
                                <div class="sub-info">
                                    <div class="sub-name">产量预测</div>
                                    <div class="sub-desc">AI预测作物产量</div>
                                    <div class="sub-status paid">¥5/次 · 剩余8次</div>
                                </div>
                                <div class="sub-actions">
                                    <span class="action-btn primary" onclick="openAgentDetail('yield-forecast')">使用</span>
                                    <span class="action-btn secondary" onclick="showRenewalModal('yield-forecast')">续费</span>
                                </div>
                            </div>
                        </div>

                        <!-- 管理操作 -->
                        <div class="subscription-actions">
                            <button class="btn-primary" onclick="loadPage('agentMarket')">
                                <i class="fas fa-plus"></i> 发现更多智能体
                            </button>
                        </div>
                    </div>

                    <!-- 续费弹窗 -->
                    <div id="renewalModal" class="modal-overlay" style="display:none" onclick="hideRenewalModal()">
                        <div class="modal-content" onclick="event.stopPropagation()">
                            <div class="modal-header">
                                <h3>续费智能体</h3>
                                <button class="modal-close" onclick="hideRenewalModal()">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="renewal-info">
                                    <div class="agent-info">
                                        <div class="agent-icon" id="renewalAgentIcon"><i class="fas fa-robot"></i></div>
                                        <div class="agent-details">
                                            <div class="agent-name" id="renewalAgentName">智能体名称</div>
                                            <div class="agent-desc" id="renewalAgentDesc">智能体描述</div>
                                        </div>
                                    </div>
                                    <div class="current-status">
                                        <span class="status-label">当前状态：</span>
                                        <span class="status-value" id="renewalCurrentStatus">剩余15次</span>
                                    </div>
                                </div>
                                <div class="renewal-options">
                                    <div class="option-title">选择续费方案</div>
                                    <div class="option-item" data-count="10" data-price="20">
                                        <div class="option-info">
                                            <div class="option-count">10次</div>
                                            <div class="option-price">¥20</div>
                                        </div>
                                        <div class="option-select">
                                            <input type="radio" name="renewalOption" value="10" checked>
                                        </div>
                                    </div>
                                    <div class="option-item" data-count="30" data-price="50">
                                        <div class="option-info">
                                            <div class="option-count">30次</div>
                                            <div class="option-price">¥50</div>
                                            <div class="option-discount">省¥10</div>
                                        </div>
                                        <div class="option-select">
                                            <input type="radio" name="renewalOption" value="30">
                                        </div>
                                    </div>
                                    <div class="option-item" data-count="100" data-price="150">
                                        <div class="option-info">
                                            <div class="option-count">100次</div>
                                            <div class="option-price">¥150</div>
                                            <div class="option-discount">省¥50</div>
                                        </div>
                                        <div class="option-select">
                                            <input type="radio" name="renewalOption" value="100">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button class="btn-secondary" onclick="hideRenewalModal()">取消</button>
                                <button class="btn-primary" onclick="confirmRenewal()">确认续费</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mobile-footer ai-center-tabbar">
                    <div class="tab-item" data-ai-tab="agentMarket" onclick="loadPage('agentMarket')"><i class="fas fa-th-large"></i><span>智能体广场</span></div>
                    <div class="tab-item" data-ai-tab="aiChatCenter" onclick="loadPage('aiChatCenter')"><i class="fas fa-comments"></i><span>AI对话</span></div>
                    <div class="tab-item active" data-ai-tab="mySubscriptions" onclick="loadPage('mySubscriptions')"><i class="fas fa-star"></i><span>我的订阅</span></div>
                </div>
            </div>
        `
    },
    workbench: {
        title: '工作台',
        subtitle: '工作台',
        content: `
            <div class="mobile-page workbench-page">
                <div class="mobile-header">
                    <h1>工作台</h1>
                    <button class="header-message-btn" onclick="showMessages()">
                        <i class="fas fa-bell"></i>
                        <span class="message-badge">3</span>
                    </button>
                </div>
                <div class="mobile-content">
                    <!-- 组织卡片 -->
                    <div class="card org-card">
                        <div class="org-row">
                            <div class="org-name">
                                龙腾虎跃有限公司（壹）
                            </div>
                            <a class="org-switch" href="javascript:void(0)">切换组织 <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                    
                    <!-- 功能网格 -->
                    <div class="card features-card">
                        <div class="features-grid">
                            <div class="feature-item clickable" onclick="loadPage('plantingPlan')">
                                <div class="fi-icon"><i class="fas fa-seedling"></i></div>
                                <div class="fi-text">种植计划</div>
                            </div>
                            <div class="feature-item clickable" onclick="loadPage('farmCalendar')">
                                <div class="fi-icon"><i class="fas fa-calendar-alt"></i></div>
                                <div class="fi-text">农事日历</div>
                            </div>
                            <div class="feature-item">
                                <div class="fi-icon"><i class="fas fa-bug"></i></div>
                                <div class="fi-text">病虫害识别</div>
                            </div>
                            <div class="feature-item">
                                <div class="fi-icon"><i class="fas fa-user-md"></i></div>
                                <div class="fi-text">专家诊断</div>
                            </div>
                            <div class="feature-item">
                                <div class="fi-icon"><i class="fas fa-warehouse"></i></div>
                                <div class="fi-text">投入品管理</div>
                            </div>
                            <div class="feature-item">
                                <div class="fi-icon"><i class="fas fa-file-signature"></i></div>
                                <div class="fi-text">投入品申请</div>
                            </div>
                            <div class="feature-item">
                                <div class="fi-icon"><i class="fas fa-people-carry"></i></div>
                                <div class="fi-text">临时工申请</div>
                            </div>
                            <div class="feature-item">
                                <div class="fi-icon"><i class="fas fa-stamp"></i></div>
                                <div class="fi-text">农事审批</div>
                            </div>
                            <div class="feature-item">
                                <div class="fi-icon"><i class="fas fa-receipt"></i></div>
                                <div class="fi-text">我的领用</div>
                            </div>
                            <div class="feature-item">
                                <div class="fi-icon"><i class="fas fa-tractor"></i></div>
                                <div class="fi-text">农机管理</div>
                            </div>
                            <div class="feature-item clickable" onclick="loadPage('fieldWorkstation')">
                                <div class="fi-icon"><i class="fas fa-microchip"></i></div>
                                <div class="fi-text">田间工作站</div>
                            </div>
                            <div class="feature-item disabled">
                                <div class="fi-icon"><i class="fas fa-ellipsis-h"></i></div>
                                <div class="fi-text">更多</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 底部导航 -->
                <div class="mobile-footer tabbar">
                    <div class="tab-item" data-page="home"><i class="fas fa-home"></i><span>首页</span></div>
                    <div class="tab-item" data-page="mall"><i class="fas fa-store"></i><span>商城</span></div>
                    <div class="tab-item" data-page="ai"><i class="fas fa-robot"></i><span>AI</span></div>
                    <div class="tab-item active" data-page="workbench"><i class="fas fa-briefcase"></i><span>工作台</span></div>
                    <div class="tab-item" data-page="profile"><i class="fas fa-user"></i><span>我的</span></div>
                </div>
            </div>
        `
    },
    ai: {
        title: 'AI',
        subtitle: '多AI能力聚合',
        content: `
            <div class="mobile-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="goBack()"><i class="fas fa-arrow-left"></i></button>
                    <h1>AI能力</h1>
                    <div class="subtitle">图片识别 · 文本问答 · 方案生成</div>
                </div>
                <div class="mobile-content">
                    <div class="ai-capabilities-grid">
                        <div class="ai-capability-card" onclick="loadPage('aiNewChat')">
                            <div class="capability-icon"><i class="fas fa-search-plus"></i></div>
                            <div class="capability-content">
                                <h3>AI病虫害识别</h3>
                                <p>上传作物图片，智能识别病虫害并给出防治建议</p>
                                <div class="capability-features"><span class="feature-tag">图片识别</span><span class="feature-tag">专家建议</span></div>
                            </div>
                            <div class="capability-arrow"><i class="fas fa-chevron-right"></i></div>
                        </div>
                        <div class="ai-capability-card" onclick="showComingSoon('AI农事问答')">
                            <div class="capability-icon"><i class="fas fa-comments"></i></div>
                            <div class="capability-content">
                                <h3>AI农事问答</h3>
                                <p>与AI对话，获取种植与管理建议</p>
                                <div class="capability-features"><span class="feature-tag">对话</span><span class="feature-tag">知识库</span></div>
                            </div>
                            <div class="capability-arrow"><i class="fas fa-chevron-right"></i></div>
                        </div>
                        <div class="ai-capability-card" onclick="showComingSoon('方案生成')">
                            <div class="capability-icon"><i class="fas fa-magic"></i></div>
                            <div class="capability-content">
                                <h3>AI方案生成</h3>
                                <p>按地块与作物，一键生成可执行的农事方案</p>
                                <div class="capability-features"><span class="feature-tag">自动化</span><span class="feature-tag">个性化</span></div>
                            </div>
                            <div class="capability-arrow"><i class="fas fa-chevron-right"></i></div>
                        </div>
                    </div>
                </div>
                <div class="mobile-footer tabbar">
                    <div class="tab-item" data-page="home"><i class="fas fa-home"></i><span>首页</span></div>
                    <div class="tab-item" data-page="mall"><i class="fas fa-store"></i><span>商城</span></div>
                    <div class="tab-item active" data-page="ai"><i class="fas fa-robot"></i><span>AI</span></div>
                    <div class="tab-item" data-page="workbench"><i class="fas fa-briefcase"></i><span>工作台</span></div>
                    <div class="tab-item" data-page="profile"><i class="fas fa-user"></i><span>我的</span></div>
                </div>
            </div>
        `
    },
    marketplace: {
        title: '商城',
        subtitle: '农资商城',
        content: `
            <div class="mobile-page market-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="goBack()"><i class="fas fa-arrow-left"></i></button>
                    <h1>农业商城</h1>
                    <div class="subtitle">优质农资一站式采购</div>
                </div>
                <div class="mobile-content">
                    <!-- 搜索框 -->
                    <div class="market-search">
                        <i class="fas fa-search"></i>
                        <input class="market-search-input" placeholder="搜索农资产品…"/>
                    </div>
                    <!-- 分类标签 -->
                    <div class="market-categories">
                        <button class="cat active"><i class="fas fa-seedling"></i><span>种子</span></button>
                        <button class="cat"><i class="fas fa-flask"></i><span>农药</span></button>
                        <button class="cat"><i class="fas fa-box"></i><span>肥料</span></button>
                        <button class="cat"><i class="fas fa-tractor"></i><span>农机</span></button>
                    </div>
                    <!-- 推荐商品 -->
                    <div class="market-section-title">推荐商品</div>
                    <div class="goods-grid">
                        <div class="goods-card">
                            <div class="goods-thumb"><i class="fas fa-leaf"></i></div>
                            <div class="goods-info">
                                <div class="goods-name">优质玉米种子</div>
                                <div class="goods-desc">高产抗病，适合本地种植</div>
                                <div class="goods-bottom">
                                    <div class="goods-price">¥45.00</div>
                                    <button class="goods-add"><i class="fas fa-plus"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="goods-card">
                            <div class="goods-thumb"><i class="fas fa-vial"></i></div>
                            <div class="goods-info">
                                <div class="goods-name">生物农药</div>
                                <div class="goods-desc">环保安全，高效防治</div>
                                <div class="goods-bottom">
                                    <div class="goods-price">¥28.50</div>
                                    <button class="goods-add"><i class="fas fa-plus"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="goods-card">
                            <div class="goods-thumb"><i class="fas fa-seedling"></i></div>
                            <div class="goods-info">
                                <div class="goods-name">有机肥料</div>
                                <div class="goods-desc">天然有机，改善土壤</div>
                                <div class="goods-bottom">
                                    <div class="goods-price">¥35.00</div>
                                    <button class="goods-add"><i class="fas fa-plus"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="goods-card">
                            <div class="goods-thumb"><i class="fas fa-tools"></i></div>
                            <div class="goods-info">
                                <div class="goods-name">小型播种机</div>
                                <div class="goods-desc">轻便高效，操作简单</div>
                                <div class="goods-bottom">
                                    <div class="goods-price">¥1,280.00</div>
                                    <button class="goods-add"><i class="fas fa-plus"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mobile-footer ai-diagnosis-footer">
                    <div class="footer-nav">
                        <div class="nav-item" data-page="home" onclick="loadPage('home')">
                            <i class="fas fa-home"></i>
                            <span>首页</span>
                        </div>
                        <div class="nav-item active" data-page="mall" onclick="loadPage('mall')">
                            <i class="fas fa-store"></i>
                            <span>商城</span>
                        </div>
                        <div class="nav-item" data-page="aiNewChat" onclick="loadPage('aiNewChat')">
                            <i class="fas fa-robot"></i>
                            <span>AI诊断</span>
                        </div>
                        <div class="nav-item" data-page="fieldWorkstation" onclick="loadPage('fieldWorkstation')">
                            <i class="fas fa-briefcase"></i>
                            <span>工作台</span>
                        </div>
                        <div class="nav-item" data-page="profile" onclick="loadPage('profile')">
                            <i class="fas fa-user"></i>
                            <span>我的</span>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    
    mall: {
        title: '商城',
        subtitle: '农资商品',
        content: `
            <div class="mobile-page real-mall-page">
                <!-- 顶部导航栏 -->
                <div class="mall-header">
                    <button class="back-btn"><i class="fas fa-chevron-left"></i></button>
                    <h1>商城</h1>
                    <div class="header-actions">
                        <button class="more-btn"><i class="fas fa-ellipsis-h"></i></button>
                        <button class="search-icon-btn"><i class="fas fa-search"></i></button>
                    </div>
                </div>

                <!-- 服务分类标签 -->
                <div class="service-tabs-wrapper">
                    <div class="service-tabs">
                        <div class="service-tab">托管服务</div>
                        <div class="service-tab">农事服务</div>
                        <div class="service-tab active">农资商品</div>
                        <div class="service-tab">农机租售</div>
                        <div class="service-tab">保险服务</div>
                    </div>
                </div>

                <!-- 子分类标签 -->
                <div class="sub-category-section">
                    <div class="sub-category-tabs">
                        <div class="sub-tab active">农药</div>
                        <div class="sub-tab">肥料</div>
                        <div class="sub-tab">种子</div>
                    </div>
                    <button class="filter-btn"><i class="fas fa-sliders-h"></i></button>
                </div>

                <!-- 搜索区域 -->
                <div class="mall-search-section">
                    <select class="search-dropdown">
                        <option>搜商品</option>
                        <option>搜店铺</option>
                    </select>
                    <input type="text" class="search-input" placeholder="">
                    <button class="search-btn">搜索</button>
                </div>

                <!-- 商品内容区域 -->
                <div class="mall-content">
                    <!-- 杀虫剂分类 -->
                    <div class="product-category">
                        <div class="category-header">
                            <h3>杀虫剂</h3>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                        <div class="products-grid-real">
                            <div class="product-card-real" onclick="loadPage('productDetail')">
                                <div class="product-img">
                                    <img src="玉米病虫害01.png" alt="农药产品" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                                    <div class="placeholder-img" style="display:none;"><i class="fas fa-box"></i></div>
                                </div>
                                <div class="product-name">史丹利高效氯氰菊酯...</div>
                                <div class="product-price">¥38</div>
                                <div class="product-shop">农跃帮小店</div>
                            </div>
                            <div class="product-card-real" onclick="loadPage('productDetail')">
                                <div class="product-img">
                                    <div class="placeholder-img" style="display:flex;"><i class="fas fa-box"></i></div>
                                </div>
                                <div class="product-name">史丹利高效氯氰菊酯...</div>
                                <div class="product-price">¥88</div>
                                <div class="product-shop">农跃帮小店</div>
                            </div>
                            <div class="product-card-real" onclick="loadPage('productDetail')">
                                <div class="product-img">
                                    <div class="placeholder-img" style="display:flex;"><i class="fas fa-box"></i></div>
                                </div>
                                <div class="product-name">史丹利高效氯氰菊酯...</div>
                                <div class="product-price">¥55</div>
                                <div class="product-shop">农跃帮小店</div>
                            </div>
                            <div class="product-card-real" onclick="loadPage('productDetail')">
                                <div class="product-img">
                                    <div class="placeholder-img" style="display:flex;"><i class="fas fa-box"></i></div>
                                </div>
                                <div class="product-name">史丹利高效氯氰菊酯...</div>
                                <div class="product-price">¥25</div>
                                <div class="product-shop">农跃帮小店</div>
                            </div>
                        </div>
                    </div>

                    <!-- 杀菌剂分类 -->
                    <div class="product-category">
                        <div class="category-header">
                            <h3>杀菌剂</h3>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                        <div class="products-grid-real">
                            <div class="product-card-real" onclick="loadPage('productDetail')">
                                <div class="product-img">
                                    <div class="placeholder-img" style="display:flex;"><i class="fas fa-box"></i></div>
                                </div>
                                <div class="product-name">苯醚甲环唑100g*5</div>
                                <div class="product-price">¥99</div>
                                <div class="product-shop">农跃帮小店</div>
                            </div>
                            <div class="product-card-real" onclick="loadPage('productDetail')">
                                <div class="product-img">
                                    <div class="placeholder-img" style="display:flex;"><i class="fas fa-box"></i></div>
                                </div>
                                <div class="product-name">苯醚甲环唑100g*3</div>
                                <div class="product-price">¥65</div>
                                <div class="product-shop">农跃帮小店</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    
    productDetail: {
        title: '商品详情',
        subtitle: '商品详细信息',
        content: `
            <div class="mobile-page product-detail-page">
                <!-- 顶部导航栏 -->
                <div class="product-header">
                    <button class="back-btn" onclick="loadPage('mall')">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <h1>商品详情</h1>
                    <div class="header-actions">
                        <button class="share-btn" onclick="showShareModal('product', '史丹利高效氯氰菊酯')">
                            <i class="fas fa-share-alt"></i>
                        </button>
                        <button class="more-btn"><i class="fas fa-ellipsis-h"></i></button>
                        <button class="search-icon-btn"><i class="fas fa-search"></i></button>
                    </div>
                </div>

                <!-- 可滚动内容区域 -->
                <div class="product-content-scroll">
                <!-- 商品轮播图 -->
                <div class="product-banner">
                    <div class="banner-image">
                        <img src="玉米病虫害01.png" alt="商品图片" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                        <div class="placeholder-banner" style="display:none;">
                            <i class="fas fa-image"></i>
                        </div>
                    </div>
                    <div class="banner-indicator">1/1</div>
                </div>

                <!-- 商品信息区域 -->
                <div class="product-info-section">
                    <!-- 商品标题 -->
                    <div class="product-title">
                        <h2>史丹利高效氯氰菊酯灵氯氰菊酯杀虫剂红蜘蛛菜</h2>
                        <button class="favorite-btn">
                            <i class="far fa-star"></i>
                            <span>收藏</span>
                        </button>
                    </div>

                    <!-- 规格和价格 -->
                    <div class="product-spec-price">
                        <div class="spec-badge">500ml</div>
                        <div class="product-price-large">¥25元</div>
                    </div>

                    <!-- 面包屑和累计下单 -->
                    <div class="product-meta">
                        <div class="breadcrumb">农资商品/农药/杀虫剂</div>
                        <div class="order-count">累计下单：<span>0</span></div>
                    </div>

                    <!-- 优惠信息 -->
                    <div class="product-promo">
                        <div class="promo-label">优惠</div>
                        <div class="promo-value">暂无</div>
                    </div>

                    <!-- 防治对象 -->
                    <div class="product-detail-item">
                        <div class="detail-label">防治对象</div>
                        <div class="detail-value">红蜘蛛</div>
                    </div>

                    <!-- 产品毒性 -->
                    <div class="product-detail-item">
                        <div class="detail-label">产品毒性</div>
                        <div class="detail-value">低毒</div>
                    </div>

                    <!-- 产品剂型 -->
                    <div class="product-detail-item">
                        <div class="detail-label">产品剂型</div>
                        <div class="detail-value">水剂</div>
                    </div>

                    <!-- 评价 -->
                    <div class="product-detail-item">
                        <div class="detail-label">评价</div>
                        <div class="detail-value">0</div>
                    </div>
                </div>

                <!-- 店铺信息 -->
                <div class="store-info-section">
                    <div class="store-header">
                        <div class="store-badge">
                            <span class="badge-text">源直达</span>
                        </div>
                        <div class="store-info">
                            <h3>农跃帮小店</h3>
                            <div class="store-trust">
                                <i class="fas fa-shield-alt"></i>
                                <span>诚信优质商家</span>
                            </div>
                            <div class="store-rating">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="far fa-star"></i>
                            </div>
                        </div>
                        <button class="store-enter-btn">进店</button>
                    </div>
                    <button class="store-follow-btn">
                        <i class="fas fa-plus"></i> 关注
                    </button>
                    <div class="store-orders">已下订单：<span>0</span></div>
                </div>
                </div>
                <!-- 结束可滚动内容区域 -->

                <!-- 底部操作栏 -->
                <div class="product-bottom-bar">
                    <button class="shop-btn" onclick="loadPage('shopDetail')">
                        <i class="fas fa-store"></i>
                        <span>店铺</span>
                    </button>
                    <button class="order-now-btn">立即下单</button>
                </div>
            </div>
        `
    },
    
    shopDetail: {
        title: '店铺详情',
        subtitle: '店铺详细信息',
        content: `
            <div class="mobile-page shop-detail-page">
                <!-- 顶部导航栏 -->
                <div class="shop-header">
                    <button class="back-btn" onclick="loadPage('productDetail')">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <h1>店铺</h1>
                    <div class="header-actions">
                        <button class="share-btn" onclick="showShareModal('shop', '农跃帮小店')">
                            <i class="fas fa-share-alt"></i>
                        </button>
                        <button class="more-btn"><i class="fas fa-ellipsis-h"></i></button>
                        <button class="search-icon-btn"><i class="fas fa-search"></i></button>
                    </div>
                </div>

                <!-- 可滚动内容区域 -->
                <div class="shop-content-scroll">
                    <!-- 店铺信息区域 -->
                    <div class="shop-info-card">
                        <div class="shop-main-info">
                            <div class="shop-logo-badge">
                                <span class="badge-text">源直达</span>
                            </div>
                            <div class="shop-info-text">
                                <h2 class="shop-name">农跃帮小店</h2>
                                <div class="shop-level">
                                    <span class="level-label">店铺等级</span>
                                    <span class="level-value">白银会员</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="shop-intro-section">
                            <span class="intro-label">店铺简介：</span>
                            <span class="intro-text">新鲜农产品，专业农资，智能农机，引领农业未来，让农业更美好！</span>
                        </div>
                        
                        <div class="shop-action-buttons">
                            <button class="shop-share-btn" onclick="showShareModal('shop', '农跃帮小店')">
                                <i class="fas fa-share-alt"></i> 分享
                            </button>
                            <button class="follow-btn">
                                <i class="fas fa-plus"></i> 关注
                            </button>
                            <button class="customer-service-btn">
                                <i class="fas fa-headset"></i> 在线客服
                            </button>
                        </div>
                    </div>

                    <!-- 分类标签 -->
                    <div class="shop-category-tabs">
                        <div class="shop-tab active">全部</div>
                        <div class="shop-tab">全程托管</div>
                        <div class="shop-tab">菜单式托管</div>
                        <div class="shop-tab">农事服务</div>
                        <div class="shop-tab">农资商品</div>
                    </div>

                    <!-- 商品网格展示 -->
                    <div class="shop-products-grid">
                        <div class="shop-product-card">
                            <div class="shop-product-img">
                                <div class="placeholder-img" style="display:flex;">
                                    <i class="fas fa-helicopter"></i>
                                </div>
                                <button class="product-share-icon" onclick="event.stopPropagation(); showShareModal('product', '无人机撒药');">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                            </div>
                            <div class="shop-product-name">无人机撒药</div>
                            <div class="shop-product-price">¥20元/亩</div>
                        </div>
                        
                        <div class="shop-product-card">
                            <div class="shop-product-img">
                                <div class="placeholder-img" style="display:flex;">
                                    <i class="fas fa-helicopter"></i>
                                </div>
                                <button class="product-share-icon" onclick="event.stopPropagation(); showShareModal('product', '无人机撒药');">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                            </div>
                            <div class="shop-product-name">无人机撒药</div>
                            <div class="shop-product-price">¥15元/亩</div>
                        </div>
                        
                        <div class="shop-product-card">
                            <div class="shop-product-img">
                                <div class="placeholder-img" style="display:flex;">
                                    <i class="fas fa-helicopter"></i>
                                </div>
                                <button class="product-share-icon" onclick="event.stopPropagation(); showShareModal('product', '无人机撒药');">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                            </div>
                            <div class="shop-product-name">无人机撒药</div>
                            <div class="shop-product-price">¥18元/亩</div>
                        </div>
                        
                        <div class="shop-product-card">
                            <div class="shop-product-img">
                                <div class="placeholder-img" style="display:flex;">
                                    <i class="fas fa-helicopter"></i>
                                </div>
                                <button class="product-share-icon" onclick="event.stopPropagation(); showShareModal('product', '无人机巡田撒药');">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                            </div>
                            <div class="shop-product-name">无人机巡田撒药</div>
                            <div class="shop-product-price">¥20元/亩</div>
                        </div>
                        
                        <div class="shop-product-card">
                            <div class="shop-product-img">
                                <div class="placeholder-img" style="display:flex;">
                                    <i class="fas fa-cog"></i>
                                </div>
                                <button class="product-share-icon" onclick="event.stopPropagation(); showShareModal('product', '无人机服务');">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                            </div>
                            <div class="shop-product-name">无人机服务</div>
                            <div class="shop-product-price">¥16元/亩</div>
                        </div>
                        
                        <div class="shop-product-card">
                            <div class="shop-product-img">
                                <div class="placeholder-img" style="display:flex;">
                                    <i class="fas fa-helicopter"></i>
                                </div>
                                <button class="product-share-icon" onclick="event.stopPropagation(); showShareModal('product', '无人机巡田');">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                            </div>
                            <div class="shop-product-name">无人机巡田</div>
                            <div class="shop-product-price">¥23元/亩</div>
                        </div>
                        
                        <div class="shop-product-card">
                            <div class="shop-product-img">
                                <div class="placeholder-img" style="display:flex;">
                                    <i class="fas fa-tractor"></i>
                                </div>
                                <button class="product-share-icon" onclick="event.stopPropagation(); showShareModal('product', '拖拉机耕地');">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                            </div>
                            <div class="shop-product-name">拖拉机耕地</div>
                            <div class="shop-product-price">¥45元/亩</div>
                        </div>
                        
                        <div class="shop-product-card">
                            <div class="shop-product-img">
                                <div class="placeholder-img" style="display:flex;">
                                    <i class="fas fa-tractor"></i>
                                </div>
                                <button class="product-share-icon" onclick="event.stopPropagation(); showShareModal('product', '联合收割机');">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                            </div>
                            <div class="shop-product-name">联合收割机</div>
                            <div class="shop-product-price">¥58元/亩</div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    
    ai: {
        title: 'AI智能助手',
        subtitle: '全方位AI能力展示',
        content: `
            <div class="mobile-page ai-page">
                <div class="mobile-header">
                    <h1>AI智能助手</h1>
                    <div class="subtitle">全方位AI能力展示</div>
                </div>
                <div class="mobile-content">
                    <!-- AI能力卡片网格 -->
                    <div class="ai-capabilities-grid">
                        <!-- AI病虫害识别 -->
                        <div class="ai-capability-card" onclick="loadPage('aiNewChat')">
                            <div class="capability-icon">
                                <i class="fas fa-search-plus"></i>
                            </div>
                            <div class="capability-content">
                                <h3>AI病虫害识别</h3>
                                <p>智能识别作物病虫害，提供精准诊断和防治建议</p>
                                <div class="capability-features">
                                    <span class="feature-tag">图片识别</span>
                                    <span class="feature-tag">专家建议</span>
                                    <span class="feature-tag">防治方案</span>
                                </div>
                            </div>
                            <div class="capability-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>

                        <!-- 作物生长模型 -->
                        <div class="ai-capability-card" onclick="showComingSoon('作物生长模型')">
                            <div class="capability-icon">
                                <i class="fas fa-seedling"></i>
                            </div>
                            <div class="capability-content">
                                <h3>作物生长模型</h3>
                                <p>基于环境数据和生长规律，预测作物生长状态和产量</p>
                                <div class="capability-features">
                                    <span class="feature-tag">生长预测</span>
                                    <span class="feature-tag">产量估算</span>
                                    <span class="feature-tag">环境分析</span>
                                </div>
                            </div>
                            <div class="capability-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>

                        <!-- 农业风险模型 -->
                        <div class="ai-capability-card" onclick="showComingSoon('农业风险模型')">
                            <div class="capability-icon">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <div class="capability-content">
                                <h3>农业风险模型</h3>
                                <p>评估农业生产风险，提供风险预警和应对策略</p>
                                <div class="capability-features">
                                    <span class="feature-tag">风险评估</span>
                                    <span class="feature-tag">预警系统</span>
                                    <span class="feature-tag">应对策略</span>
                                </div>
                            </div>
                            <div class="capability-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>

                        <!-- 灾害预警模型 -->
                        <div class="ai-capability-card" onclick="showComingSoon('灾害预警模型')">
                            <div class="capability-icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <div class="capability-content">
                                <h3>灾害预警模型</h3>
                                <p>实时监测气象数据，提前预警自然灾害对农业的影响</p>
                                <div class="capability-features">
                                    <span class="feature-tag">气象监测</span>
                                    <span class="feature-tag">灾害预警</span>
                                    <span class="feature-tag">影响评估</span>
                                </div>
                            </div>
                            <div class="capability-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>

                        <!-- 专家模型 -->
                        <div class="ai-capability-card" onclick="showComingSoon('专家模型')">
                            <div class="capability-icon">
                                <i class="fas fa-user-graduate"></i>
                            </div>
                            <div class="capability-content">
                                <h3>专家模型</h3>
                                <p>集成农业专家知识，提供专业咨询和决策支持</p>
                                <div class="capability-features">
                                    <span class="feature-tag">专家知识</span>
                                    <span class="feature-tag">智能咨询</span>
                                    <span class="feature-tag">决策支持</span>
                                </div>
                            </div>
                            <div class="capability-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                    </div>

                    <!-- AI使用统计 -->
                    <div class="ai-stats-section">
                        <h3>AI使用统计</h3>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-number">156</div>
                                <div class="stat-label">今日诊断</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">89%</div>
                                <div class="stat-label">准确率</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">2.3k</div>
                                <div class="stat-label">累计服务</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    
    aiDiagnosis: {
        title: '诊断结果',
        subtitle: '智能识别 · 专家建议',
        content: `
            <div class="mobile-page ai-diagnosis-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="loadPage('aiNewChat')">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h1>诊断结果</h1>
                </div>
                <div class="mobile-content">
                    <!-- 用户提交内容回显 -->
                    <div class="card user-input-summary" id="userInputSummary">
                        <div class="card-title">
                            <i class="fas fa-user-check"></i>
                            您的提交内容
                        </div>
                        <div class="input-summary-content" id="inputSummaryContent">
                            <div class="summary-images" id="summaryImages"></div>
                            <div class="summary-text" id="summaryText"></div>
                        </div>
                    </div>

                    <!-- 诊断状态卡片 -->
                    <div class="card diagnosis-status-card" id="diagnosisStatusCard">
                        <div class="progress-steps">
                            <div class="progress-step" id="step-1">
                                <div class="step-box">
                                    <div class="step-icon">📷</div>
                                    <div class="step-check">✅</div>
                                </div>
                                <div class="step-text">图像识别</div>
                            </div>
                            <div class="progress-step" id="step-2">
                                <div class="step-box">
                                    <div class="step-icon">🧠</div>
                                    <div class="step-check">✅</div>
                                </div>
                                <div class="step-text">AI分析</div>
                            </div>
                            <div class="progress-step" id="step-3">
                                <div class="step-box">
                                    <div class="step-icon">🔍</div>
                                    <div class="step-check">✅</div>
                                </div>
                                <div class="step-text">特征匹配</div>
                            </div>
                            <div class="progress-step" id="step-4">
                                <div class="step-box">
                                    <div class="step-icon">📝</div>
                                    <div class="step-check">✅</div>
                                </div>
                                <div class="step-text">结果生成</div>
                            </div>
                        </div>
                    </div>

                    <!-- AI诊断结果 -->
                    <div class="card diagnosis-result-card" id="diagnosisResult" style="display: none;">
                        <div class="card-title">
                            <i class="fas fa-check-circle"></i>
                            AI诊断结果
                        </div>
                        <div class="result-content">
                            <div class="disease-info">
                                <div class="disease-name">疑似：玉米锈病</div>
                                <div class="confidence">相似度：91%</div>
                            </div>
                            <div class="disease-desc">
                                根据您提供的图片，这是一片玉米叶片，其上出现的黄褐色斑点和条状病斑，结合发病部位及症状特征，高度疑似玉米南方锈病(Southern Corn Rust, Puccinia polysora)。
                            </div>
                            
                            <div class="diagnosis-basis">
                                <div class="basis-title">
                                    <i class="fas fa-check-circle"></i>
                                    诊断依据
                                </div>
                                <div class="basis-content">
                                    <div class="basis-item">
                                        <div class="basis-label">病斑形态：</div>
                                        <div class="basis-text">病斑呈橙色至红褐色，小而密集，通常在叶面形成不规则的斑块。随着病情发展，病斑逐渐变为黄褐色或灰白色，表面可能有细小的粉状物(孢子堆)，尤其在高湿条件下更明显。</div>
                                    </div>
                                    <div class="basis-item">
                                        <div class="basis-label">发病部位：</div>
                                        <div class="basis-text">主要发生在叶片的中下部，向上蔓延，严重时可覆盖整个叶片。</div>
                                    </div>
                                    <div class="basis-item">
                                        <div class="basis-label">流行条件：</div>
                                        <div class="basis-text">高温高湿(25-30℃)、多雨、通风不良的环境易发。该病在夏玉米区、南方产区尤为常见，近年来在我国华南、西南、黄淮海地区均有爆发趋势。</div>
                                    </div>
                                    <div class="basis-item">
                                        <div class="basis-label">与其它病害的区别：</div>
                                        <div class="basis-text">玉米大斑病：病斑较大，呈长椭圆形，边缘紫褐色，中央灰白，无粉状物。玉米小斑病：病斑较小，呈椭圆形，边缘深褐色，中央浅褐色。</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="diagnosis-image">
                                <img src="image.png" alt="玉米锈病症状图片" />
                            </div>
                        </div>
                    </div>

                    <!-- 专家推荐与连线 - 合并设计 -->
                    <div class="card expert-section-card" id="expertSection" style="display: none;">
                        <div class="card-title">
                            <i class="fas fa-user-md"></i>
                            专家推荐与连线
                        </div>
                        
                        <!-- 专家卡片滑动区域 -->
                        <div class="experts-carousel">
                            <div class="experts-container" id="expertsContainer">
                                <!-- 专家卡片1 -->
                                <div class="expert-card active">
                                    <div class="expert-avatar">
                                        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiM0Q0FGNTIiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+" alt="专家头像">
                                    </div>
                                    <div class="expert-info">
                                        <div class="expert-name">张农技专家</div>
                                        <div class="expert-title">高级农艺师 · 15年经验</div>
                                        <div class="expert-specialty">专长：叶斑病防治</div>
                                    </div>
                                    <div class="expert-badges">
                                        <span class="badge expert">认证专家</span>
                                        <span class="badge rating">评分 4.9</span>
                                    </div>
                                    <div class="expert-recommendation">
                                        <div class="recommendation-title">防治建议：</div>
                                        <div class="recommendation-text">
                                            1. 立即清除病叶，减少病原菌传播<br>
                                            2. 改善通风条件，降低湿度<br>
                                            3. 使用推荐药剂进行防治
                                        </div>
                                    </div>
                                    <div class="expert-actions">
                                        <button class="btn-connect-voice">
                                            <i class="fas fa-phone"></i>
                                            语音咨询 ¥50
                                        </button>
                                        <button class="btn-connect-video">
                                            <i class="fas fa-video"></i>
                                            视频指导 ¥80
                                        </button>
                                    </div>
                                </div>

                                <!-- 专家卡片2 -->
                                <div class="expert-card">
                                    <div class="expert-avatar">
                                        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+" alt="专家头像">
                                    </div>
                                    <div class="expert-info">
                                        <div class="expert-name">李植保专家</div>
                                        <div class="expert-title">植保专家 · 12年经验</div>
                                        <div class="expert-specialty">专长：病害诊断</div>
                                    </div>
                                    <div class="expert-badges">
                                        <span class="badge expert">认证专家</span>
                                        <span class="badge rating">评分 4.8</span>
                                    </div>
                                    <div class="expert-recommendation">
                                        <div class="recommendation-title">防治建议：</div>
                                        <div class="recommendation-text">
                                            1. 加强田间管理，预防病害<br>
                                            2. 合理施肥，增强抗病性<br>
                                            3. 及时用药，控制病情发展
                                        </div>
                                    </div>
                                    <div class="expert-actions">
                                        <button class="btn-connect-voice">
                                            <i class="fas fa-phone"></i>
                                            语音咨询 ¥50
                                        </button>
                                        <button class="btn-connect-video">
                                            <i class="fas fa-video"></i>
                                            视频指导 ¥80
                                        </button>
                                    </div>
                                </div>

                                <!-- 专家卡片3 -->
                                <div class="expert-card">
                                    <div class="expert-avatar">
                                        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNGRjY5MDAiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+" alt="专家头像">
                                    </div>
                                    <div class="expert-info">
                                        <div class="expert-name">王农艺师</div>
                                        <div class="expert-title">农艺师 · 18年经验</div>
                                        <div class="expert-specialty">专长：综合防治</div>
                                    </div>
                                    <div class="expert-badges">
                                        <span class="badge expert">认证专家</span>
                                        <span class="badge rating">评分 4.9</span>
                                    </div>
                                    <div class="expert-recommendation">
                                        <div class="recommendation-title">防治建议：</div>
                                        <div class="recommendation-text">
                                            1. 综合防治，标本兼治<br>
                                            2. 生物防治与化学防治结合<br>
                                            3. 长期监控，预防为主
                                        </div>
                                    </div>
                                    <div class="expert-actions">
                                        <button class="btn-connect-voice">
                                            <i class="fas fa-phone"></i>
                                            语音咨询 ¥50
                                        </button>
                                        <button class="btn-connect-video">
                                            <i class="fas fa-video"></i>
                                            视频指导 ¥80
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 滑动指示器 -->
                            <div class="carousel-indicators">
                                <span class="indicator active" data-index="0"></span>
                                <span class="indicator" data-index="1"></span>
                                <span class="indicator" data-index="2"></span>
                            </div>
                        </div>
                    </div>

                    <!-- 推荐农资产品 - 简化设计 -->
                    <div class="card product-recommendation-card" id="productRecommendation" style="display: none;">
                        <div class="card-title">
                            <i class="fas fa-shopping-cart"></i>
                            推荐农资产品
                        </div>
                        
                        <div class="product-list">
                            <div class="product-item">
                                <div class="product-info">
                                    <div class="product-name">多菌灵可湿性粉剂</div>
                                    <div class="product-desc">广谱杀菌剂，对叶斑病效果显著</div>
                                    <div class="product-tags">
                                        <span class="tag expert-tag">专家推荐</span>
                                        <span class="tag ai-tag">AI匹配</span>
                                    </div>
                                </div>
                                <div class="product-price">
                                    <div class="price">¥28.00</div>
                                    <button class="btn-buy">立即购买</button>
                                </div>
                            </div>
                            
                            <div class="product-item">
                                <div class="product-info">
                                    <div class="product-name">代森锰锌水分散粒剂</div>
                                    <div class="product-desc">保护性杀菌剂，预防效果佳</div>
                                    <div class="product-tags">
                                        <span class="tag ai-tag">AI推荐</span>
                                    </div>
                                </div>
                                <div class="product-price">
                                    <div class="price">¥35.00</div>
                                    <button class="btn-buy">立即购买</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 底部三菜单（AI 相关） -->
                <div class="mobile-footer ai-diagnosis-footer">
                    <div class="footer-nav">
                        <div class="nav-item" onclick="loadPage('aiNewChat')">
                            <i class="fas fa-plus"></i>
                            <span>AI诊断</span>
                        </div>
                        <div class="nav-item" onclick="loadPage('expertRecommend')">
                            <i class="fas fa-user-md"></i>
                            <span>专家推荐</span>
                        </div>
                        <div class="nav-item" onclick="loadPage('historyDialog')">
                            <i class="fas fa-history"></i>
                            <span>历史对话</span>
                        </div>
                    </div>
                </div>
            </div>
        `
    },

    aiNewChat: {
        title: 'AI诊断',
        subtitle: '发起新的AI诊断会话',
        content: `
            <div class="mobile-page ai-newchat-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="loadPage('home')"><i class="fas fa-arrow-left"></i></button>
                    <h1>AI诊断</h1>
                </div>
                <div class="mobile-content">
                    <div class="card ai-diagnosis-card">
                        <div class="ai-card-header">
                            <div class="ai-card-title"><i class="fas fa-robot"></i><span>AI病虫害诊断</span></div>
                            <div class="ai-card-subtitle">描述问题，上传图片，开始一次新的诊断</div>
                        </div>
                        <div class="ai-card-content">
                            <div class="combined-input-container">
                                <textarea id="inlineQuestionTextarea" class="combined-textarea" placeholder="告诉我您的问题吧～" rows="4"></textarea>
                                <div class="embedded-upload-area">
                                    <div class="embedded-upload-trigger" id="embeddedUploadTrigger"><i class="fas fa-image"></i><span>添加图片</span></div>
                                    <div class="embedded-image-preview" id="embeddedImagePreview"></div>
                                </div>
                                <input type="file" id="embeddedImageInput" accept="image/*" style="display:none" multiple>
                            </div>
                            <div style="text-align:center; margin-top:10px;">
                                <a href="javascript:void(0)" onclick="loadPage('historyDialog')" style="color:#9aa0a6; font-size:12px;">查看历史记录</a>
                            </div>
                            <div class="ai-card-actions">
                                <button class="btn-start-ai-diagnosis" onclick="submitNewConversation()"><i class="fas fa-brain"></i><span>开始AI诊断</span></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mobile-footer ai-diagnosis-footer">
                    <div class="footer-nav">
                        <div class="nav-item active" onclick="loadPage('aiNewChat')"><i class="fas fa-plus"></i><span>AI诊断</span></div>
                        <div class="nav-item" onclick="loadPage('expertRecommend')"><i class="fas fa-user-md"></i><span>专家推荐</span></div>
                        <div class="nav-item" onclick="loadPage('historyDialog')"><i class="fas fa-history"></i><span>历史对话</span></div>
                    </div>
                </div>
            </div>
        `
    },

    expertRecommend: {
        title: '专家推荐',
        subtitle: '为您匹配合适的专家',
        content: `
            <div class="mobile-page expert-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="loadPage('home')"><i class="fas fa-arrow-left"></i></button>
                    <h1>专家推荐</h1>
                </div>
                <div class="mobile-content">
                    <div class="card">
                        <div class="search-bar"><i class="fas fa-search"></i><input type="text" placeholder="搜索专家/标签/知识库"></div>
                    </div>
                    <div class="card expert-card" onclick="loadPage('expertDetail', 'wangjianguo')">
                        <div class="expert-header">
                            <div class="avatar"><i class="fas fa-user-tie"></i></div>
                            <div class="info">
                                <div class="name">王建国</div>
                                <div class="tags"><span class="tag">玉米病害</span><span class="tag">小麦锈病</span></div>
                            </div>
                            <button class="btn" style="padding:8px 12px;">查看</button>
                        </div>
                        <div class="expert-extras">
                            <div>专家知识库（可购买）</div>
                            <div class="product-tags"><span class="tag">杀菌剂A</span><span class="tag">防治套餐</span></div>
                        </div>
                    </div>
                    <div class="card expert-card" onclick="loadPage('expertDetail', 'limin')">
                        <div class="expert-header">
                            <div class="avatar"><i class="fas fa-user-tie"></i></div>
                            <div class="info">
                                <div class="name">李敏</div>
                                <div class="tags"><span class="tag">水稻虫害</span><span class="tag">植保方案</span></div>
                            </div>
                            <button class="btn" style="padding:8px 12px;">查看</button>
                        </div>
                        <div class="expert-extras">
                            <div>专家知识库（可购买）</div>
                            <div class="product-tags"><span class="tag">虫害套装</span></div>
                        </div>
                    </div>
                    <div class="card expert-card" onclick="loadPage('expertDetail', 'zhangsan')">
                        <div class="expert-header">
                            <div class="avatar"><i class="fas fa-user-tie"></i></div>
                            <div class="info">
                                <div class="name">张三</div>
                                <div class="tags"><span class="tag">果树病害</span><span class="tag">土壤改良</span></div>
                            </div>
                            <button class="btn" style="padding:8px 12px;">查看</button>
                        </div>
                        <div class="expert-extras">
                            <div>专家知识库（可购买）</div>
                            <div class="product-tags"><span class="tag">有机肥料</span><span class="tag">土壤调理剂</span></div>
                        </div>
                    </div>
                    <div class="card expert-card" onclick="loadPage('expertDetail', 'lisi')">
                        <div class="expert-header">
                            <div class="avatar"><i class="fas fa-user-tie"></i></div>
                            <div class="info">
                                <div class="name">李四</div>
                                <div class="tags"><span class="tag">蔬菜种植</span><span class="tag">温室管理</span></div>
                            </div>
                            <button class="btn" style="padding:8px 12px;">查看</button>
                        </div>
                        <div class="expert-extras">
                            <div>专家知识库（可购买）</div>
                            <div class="product-tags"><span class="tag">温室设备</span><span class="tag">种植技术</span></div>
                        </div>
                    </div>
                    <div class="card expert-card" onclick="loadPage('expertDetail', 'wangwu')">
                        <div class="expert-header">
                            <div class="avatar"><i class="fas fa-user-tie"></i></div>
                            <div class="info">
                                <div class="name">王五</div>
                                <div class="tags"><span class="tag">植保技术</span><span class="tag">农药使用</span></div>
                            </div>
                            <button class="btn" style="padding:8px 12px;">查看</button>
                        </div>
                        <div class="expert-extras">
                            <div>专家知识库（可购买）</div>
                            <div class="product-tags"><span class="tag">安全用药</span><span class="tag">植保方案</span></div>
                        </div>
                    </div>
                </div>
                <div class="mobile-footer ai-diagnosis-footer">
                    <div class="footer-nav">
                        <div class="nav-item" onclick="loadPage('aiNewChat')"><i class="fas fa-plus"></i><span>AI诊断</span></div>
                        <div class="nav-item active" onclick="loadPage('expertRecommend')"><i class="fas fa-user-md"></i><span>专家推荐</span></div>
                        <div class="nav-item" onclick="loadPage('historyDialog')"><i class="fas fa-history"></i><span>历史对话</span></div>
                    </div>
                </div>
            </div>
        `
    },

    historyDialog: {
        title: '历史对话',
        subtitle: '查看以往会话',
        content: `
            <div class="mobile-page history-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="loadPage('home')"><i class="fas fa-arrow-left"></i></button>
                    <h1>历史对话</h1>
                </div>
                <div class="mobile-content">
                    <div class="card">
                        <div class="search-bar"><i class="fas fa-search"></i><input type="text" placeholder="搜索历史问题/日期" oninput="filterHistory(this.value)"></div>
                    </div>
                    <div class="card history-item" onclick="loadPage('aiDiagnosis', 'conv1')">
                        <div class="history-header">
                            <div class="history-title">玉米叶片出现黄褐色斑点</div>
                            <div class="history-date">2024-01-15 14:30</div>
                        </div>
                        <div class="history-content">
                            <div class="history-preview">疑似玉米锈病，建议使用多菌灵可湿性粉剂进行防治...</div>
                            <div class="history-status completed">已完成</div>
                        </div>
                    </div>
                    <div class="card history-item" onclick="loadPage('aiDiagnosis', 'conv2')">
                        <div class="history-header">
                            <div class="history-title">小麦叶片有白色粉末状物质</div>
                            <div class="history-date">2024-01-14 09:15</div>
                        </div>
                        <div class="history-content">
                            <div class="history-preview">诊断为小麦白粉病，推荐使用三唑酮进行防治...</div>
                            <div class="history-status completed">已完成</div>
                        </div>
                    </div>
                    <div class="card history-item" onclick="loadPage('aiDiagnosis', 'conv3')">
                        <div class="history-header">
                            <div class="history-title">水稻叶片边缘发黄枯萎</div>
                            <div class="history-date">2024-01-13 16:45</div>
                        </div>
                        <div class="history-content">
                            <div class="history-preview">可能是水稻纹枯病，建议改善田间通风条件...</div>
                            <div class="history-status completed">已完成</div>
                        </div>
                    </div>
                    <div class="card history-item" onclick="loadPage('aiDiagnosis', 'conv4')">
                        <div class="history-header">
                            <div class="history-title">番茄果实表面有黑色斑点</div>
                            <div class="history-date">2024-01-12 11:20</div>
                        </div>
                        <div class="history-content">
                            <div class="history-preview">疑似番茄早疫病，推荐使用代森锰锌进行防治...</div>
                            <div class="history-status completed">已完成</div>
                        </div>
                    </div>
                    <div class="card history-item" onclick="loadPage('aiDiagnosis', 'conv5')">
                        <div class="history-header">
                            <div class="history-title">黄瓜叶片出现水渍状病斑</div>
                            <div class="history-date">2024-01-11 08:30</div>
                        </div>
                        <div class="history-content">
                            <div class="history-preview">诊断为黄瓜霜霉病，建议使用甲霜灵进行防治...</div>
                            <div class="history-status completed">已完成</div>
                        </div>
                    </div>
                </div>
                <div class="mobile-footer ai-diagnosis-footer">
                    <div class="footer-nav">
                        <div class="nav-item" onclick="loadPage('aiNewChat')"><i class="fas fa-plus"></i><span>AI诊断</span></div>
                        <div class="nav-item" onclick="loadPage('expertRecommend')"><i class="fas fa-user-tie"></i><span>专家推荐</span></div>
                        <div class="nav-item active" onclick="loadPage('historyDialog')"><i class="fas fa-history"></i><span>历史对话</span></div>
                    </div>
                </div>
            </div>
        `
    },

    expertDetail: {
        title: '专家详情',
        subtitle: '专家信息与服务',
        content: `
            <div class="mobile-page expert-detail-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="loadPage('expertRecommend')"><i class="fas fa-arrow-left"></i></button>
                    <h1>专家详情</h1>
                </div>
                <div class="mobile-content">
                    <div class="card expert-profile-card">
                        <div class="expert-avatar-large">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div class="expert-info">
                            <h2 id="expertName">王建国</h2>
                            <div class="expert-title">认证专家 · 评分 4.9</div>
                            <div class="expert-specialties" id="expertSpecialties">
                                <span class="tag">玉米病害</span>
                                <span class="tag">小麦锈病</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-title">
                            <i class="fas fa-graduation-cap"></i>
                            专业背景
                        </div>
                        <div class="expert-background" id="expertBackground">
                            从事农业植保工作15年，专注于玉米和小麦病害研究，发表相关论文20余篇，具有丰富的田间实践经验。
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-title">
                            <i class="fas fa-book"></i>
                            知识库服务
                        </div>
                        <div class="knowledge-items" id="knowledgeItems">
                            <div class="knowledge-item">
                                <div class="knowledge-title">玉米病害诊断手册</div>
                                <div class="knowledge-desc">包含50+种玉米常见病害的识别与防治方法</div>
                                <div class="knowledge-price">¥29.9</div>
                            </div>
                            <div class="knowledge-item">
                                <div class="knowledge-title">小麦锈病防治方案</div>
                                <div class="knowledge-desc">专业的小麦锈病预防与治疗指导</div>
                                <div class="knowledge-price">¥19.9</div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-title">
                            <i class="fas fa-shopping-cart"></i>
                            推荐产品
                        </div>
                        <div class="product-items" id="productItems">
                            <div class="product-item">
                                <div class="product-name">杀菌剂A</div>
                                <div class="product-desc">广谱杀菌剂，对叶斑病效果显著</div>
                                <div class="product-tags">
                                    <span class="tag">专家推荐</span>
                                    <span class="tag">AI匹配</span>
                                </div>
                                <div class="product-price">¥28.00</div>
                                <button class="btn-buy">立即购买</button>
                            </div>
                            <div class="product-item">
                                <div class="product-name">防治套餐</div>
                                <div class="product-desc">综合防治方案，包含多种药剂</div>
                                <div class="product-tags">
                                    <span class="tag">专家推荐</span>
                                </div>
                                <div class="product-price">¥128.00</div>
                                <button class="btn-buy">立即购买</button>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-title">
                            <i class="fas fa-phone"></i>
                            咨询服务
                        </div>
                        <div class="consultation-options">
                            <button class="consultation-btn voice-consult">
                                <i class="fas fa-phone"></i>
                                <span>语音咨询</span>
                                <span class="price">¥50/次</span>
                            </button>
                            <button class="consultation-btn video-consult">
                                <i class="fas fa-video"></i>
                                <span>视频指导</span>
                                <span class="price">¥80/次</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    
    profile: {
        title: '我的',
        subtitle: '个人中心',
        content: `
            <div class="mobile-page profile-page">
                <div class="mobile-header">
                    <h1>我的</h1>
                    <div class="header-actions">
                        <i class="fas fa-ellipsis-v"></i>
                        <i class="fas fa-bullseye"></i>
                    </div>
                </div>
                <div class="mobile-content">
                    <!-- 用户信息卡片 -->
                    <div class="user-profile-card">
                        <div class="user-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="user-info">
                            <div class="user-name">龙</div>
                            <div class="user-org">龙腾虎跃有限公司（壹）</div>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </div>
                    
                    <!-- 电商服务 -->
                    <div class="card">
                        <div class="card-title">电商服务</div>
                        <div class="ecommerce-grid">
                            <div class="ecommerce-item">
                                <div class="ecommerce-icon orange"><i class="fas fa-shopping-cart"></i></div>
                                <div class="ecommerce-text">购物车</div>
                            </div>
                            <div class="ecommerce-item">
                                <div class="ecommerce-icon blue"><i class="fas fa-file-alt"></i></div>
                                <div class="ecommerce-text">我的订单</div>
                            </div>
                            <div class="ecommerce-item">
                                <div class="ecommerce-icon orange"><i class="fas fa-star"></i></div>
                                <div class="ecommerce-text">我的评价</div>
                            </div>
                            <div class="ecommerce-item">
                                <div class="ecommerce-icon blue"><i class="fas fa-map-marker-alt"></i></div>
                                <div class="ecommerce-text">地址管理</div>
                            </div>
                            <div class="ecommerce-item">
                                <div class="ecommerce-icon orange"><i class="fas fa-heart"></i></div>
                                <div class="ecommerce-text">我的关注</div>
                            </div>
                            <div class="ecommerce-item">
                                <div class="ecommerce-icon blue"><i class="fas fa-headset"></i></div>
                                <div class="ecommerce-text">售后服务</div>
                            </div>
                            <div class="ecommerce-item">
                                <div class="ecommerce-icon green"><i class="fas fa-history"></i></div>
                                <div class="ecommerce-text">浏览记录</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 其它功能 -->
                    <div class="card">
                        <div class="card-title">其它</div>
                        <div class="other-functions">
                            <div class="other-item">
                                <div class="other-icon green"><i class="fas fa-sitemap"></i></div>
                                <div class="other-text">组织架构管理</div>
                                <i class="fas fa-chevron-right"></i>
                            </div>
                            <div class="other-item">
                                <div class="other-icon green"><i class="fas fa-lock"></i></div>
                                <div class="other-text">账号与安全</div>
                                <i class="fas fa-chevron-right"></i>
                            </div>
                            <div class="other-item">
                                <div class="other-icon green"><i class="fas fa-comment-dots"></i></div>
                                <div class="other-text">意见反馈</div>
                                <i class="fas fa-chevron-right"></i>
                            </div>
                            <div class="other-item">
                                <div class="other-icon green"><i class="fas fa-info-circle"></i></div>
                                <div class="other-text">关于我们</div>
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 操作按钮 -->
                    <div class="action-buttons">
                        <button class="btn-primary">开启个人农场</button>
                        <button class="btn-secondary">退出登录</button>
                    </div>
                </div>
                
                <!-- 浮动按钮 -->
                <div class="floating-buttons">
                    <div class="float-action-btn ai-assistant">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="float-action-btn customer-service">
                        <i class="fas fa-headset"></i>
                    </div>
                </div>

                <!-- 底部导航 -->
                <div class="mobile-footer tabbar">
                    <div class="tab-item" data-page="home"><i class="fas fa-home"></i><span>首页</span></div>
                    <div class="tab-item" data-page="mall"><i class="fas fa-store"></i><span>商城</span></div>
                    <div class="tab-item" data-page="ai"><i class="fas fa-robot"></i><span>AI</span></div>
                    <div class="tab-item" data-page="workbench"><i class="fas fa-briefcase"></i><span>工作台</span></div>
                    <div class="tab-item active" data-page="profile"><i class="fas fa-user"></i><span>我的</span></div>
                </div>
            </div>
        `
    },
    
    messages: {
        title: '消息',
        subtitle: '消息中心',
        content: `
            <div class="mobile-page">
                <div class="mobile-header">
                    <h1>消息</h1>
                </div>
                <div class="mobile-content">
                    <div class="card">
                        <div class="empty-state">
                            <i class="fas fa-comment-slash"></i>
                            <h3>暂无消息</h3>
                            <p>您还没有收到任何消息</p>
                        </div>
                    </div>
                </div>

                <!-- 底部导航 -->
                <div class="mobile-footer tabbar">
                    <div class="tab-item" data-page="home"><i class="fas fa-home"></i><span>首页</span></div>
                    <div class="tab-item" data-page="workbench"><i class="fas fa-briefcase"></i><span>工作台</span></div>
                    <div class="tab-item active" data-page="messages"><i class="fas fa-comment"></i><span>消息</span></div>
                    <div class="tab-item" data-page="profile"><i class="fas fa-user"></i><span>我的</span></div>
                </div>
            </div>
        `
    },
    
    settings: {
        title: '设置',
        subtitle: '系统设置与偏好',
        content: `
            <div class="mobile-page">
                <div class="mobile-header">
                    <h1>设置</h1>
                    <div class="subtitle">系统设置与偏好</div>
                </div>
                <div class="mobile-content">
                    <div class="card">
                        <div class="list-item">
                            <div class="list-item-icon">
                                <i class="fas fa-bell"></i>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">消息通知</div>
                                <div class="list-item-subtitle">管理推送通知设置</div>
                            </div>
                            <div class="list-item-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                        <div class="list-item">
                            <div class="list-item-icon">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">隐私安全</div>
                                <div class="list-item-subtitle">账户安全设置</div>
                            </div>
                            <div class="list-item-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                        <div class="list-item">
                            <div class="list-item-icon">
                                <i class="fas fa-language"></i>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">语言设置</div>
                                <div class="list-item-subtitle">简体中文</div>
                            </div>
                            <div class="list-item-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                        <div class="list-item">
                            <div class="list-item-icon">
                                <i class="fas fa-moon"></i>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">深色模式</div>
                                <div class="list-item-subtitle">切换深色主题</div>
                            </div>
                            <div class="list-item-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="list-item">
                            <div class="list-item-icon">
                                <i class="fas fa-question-circle"></i>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">帮助中心</div>
                                <div class="list-item-subtitle">使用指南与常见问题</div>
                            </div>
                            <div class="list-item-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                        <div class="list-item">
                            <div class="list-item-icon">
                                <i class="fas fa-info-circle"></i>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">关于我们</div>
                                <div class="list-item-subtitle">版本 1.0.0</div>
                            </div>
                            <div class="list-item-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    
    farmCalendar: {
        title: '农事日历',
        subtitle: '农事活动管理',
        content: `
            <div class="mobile-page farmCalendar-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="goBack()"><i class="fas fa-arrow-left"></i></button>
                    <h1>农事日历</h1>
                    <div class="subtitle">农事活动管理</div>
                </div>
                <div class="mobile-content">
                    <!-- 日历导航 -->
                    <div class="calendar-nav">
                        <div class="calendar-header">
                            <i class="fas fa-chevron-left"></i>
                            <span>2024年1月</span>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                        <div class="weekdays">
                            <div class="weekday">日</div>
                            <div class="weekday">一</div>
                            <div class="weekday">二</div>
                            <div class="weekday">三</div>
                            <div class="weekday">四</div>
                            <div class="weekday">五</div>
                            <div class="weekday">六</div>
                        </div>
                        <div class="date-row">
                            <div class="date-item">
                                <div class="date-number">31</div>
                                <div class="date-text">12月</div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">1</div>
                                <div class="date-text">元旦</div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">2</div>
                                <div class="date-text"></div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">3</div>
                                <div class="date-text"></div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">4</div>
                                <div class="date-text"></div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">5</div>
                                <div class="date-text"></div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">6</div>
                                <div class="date-text"></div>
                            </div>
                        </div>
                        <div class="date-row">
                            <div class="date-item">
                                <div class="date-number">7</div>
                                <div class="date-text"></div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">8</div>
                                <div class="date-text"></div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">9</div>
                                <div class="date-text"></div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">10</div>
                                <div class="date-text"></div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">11</div>
                                <div class="date-text"></div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">12</div>
                                <div class="date-text"></div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">13</div>
                                <div class="date-text"></div>
                            </div>
                        </div>
                        <div class="date-row">
                            <div class="date-item">
                                <div class="date-number">14</div>
                                <div class="date-text"></div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">15</div>
                                <div class="date-text"></div>
                            </div>
                            <div class="date-item today">
                                <div class="date-number">16</div>
                                <div class="date-text">今天</div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">17</div>
                                <div class="date-text"></div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">18</div>
                                <div class="date-text"></div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">19</div>
                                <div class="date-text"></div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">20</div>
                                <div class="date-text"></div>
                            </div>
                        </div>
                        <div class="calendar-expand">
                            <i class="fas fa-chevron-down"></i> 展开更多
                        </div>
                    </div>
                    
                    <!-- 活动列表 -->
                    <div class="activities-section">
                        <h3>今日活动</h3>
                        <div class="activity-card" onclick="loadPage('farmActivityDetail')">
                            <div class="activity-header">
                                <span class="activity-tag spraying">打药</span>
                                <div class="activity-title">打药测试 1</div>
                                <i class="fas fa-ellipsis-v activity-menu"></i>
                            </div>
                            <div class="activity-details">
                                <div class="detail-item">
                                    <span class="detail-label">时间：</span>
                                    <span class="detail-value">09:00 - 11:00</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">地点：</span>
                                    <span class="detail-value">A区小麦田</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">负责人：</span>
                                    <span class="detail-value">张三</span>
                                </div>
                            </div>
                            <div class="activity-status">
                                <div class="status-stamp">已完成</div>
                            </div>
                        </div>
                        
                        <div class="activity-card">
                            <div class="activity-header">
                                <span class="activity-tag weeding">除草</span>
                                <div class="activity-title">除草作业</div>
                                <i class="fas fa-ellipsis-v activity-menu"></i>
                            </div>
                            <div class="activity-details">
                                <div class="detail-item">
                                    <span class="detail-label">时间：</span>
                                    <span class="detail-value">14:00 - 16:00</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">地点：</span>
                                    <span class="detail-value">B区玉米田</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">负责人：</span>
                                    <span class="detail-value">李四</span>
                                </div>
                            </div>
                            <div class="activity-status">
                                <div class="status-stamp">进行中</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 悬浮添加按钮 -->
                <div class="float-action-btn">
                    <i class="fas fa-plus"></i>
                </div>
            </div>
        `
    },
    
    plantingPlan: {
        title: '种植计划',
        subtitle: '管理种植计划',
        content: `
            <div class="mobile-page plantingPlan-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="goBack()"><i class="fas fa-arrow-left"></i></button>
                    <h1>种植计划</h1>
                    <div class="subtitle">管理种植计划</div>
                </div>
                <div class="mobile-content">
                    <!-- 主导航标签 -->
                    <div class="plan-tabs">
                        <div class="plan-tab">
                            <i class="fas fa-book"></i>
                            <span>指导方案库</span>
                        </div>
                        <div class="plan-tab active">
                            <i class="fas fa-file-alt"></i>
                            <span>我的方案</span>
                        </div>
                    </div>
                    
                    <!-- 子标签过滤器 -->
                    <div class="filter-tabs">
                        <div class="filter-tab">全部</div>
                        <div class="filter-tab">未开始</div>
                        <div class="filter-tab active">进行中</div>
                        <div class="filter-tab">已完成</div>
                    </div>
                    
                    <!-- 种植计划卡片 -->
                    <div class="plan-card">
                        <div class="plan-header">
                            <div class="plan-status">
                                <span class="status-badge">进行中</span>
                                <span class="plan-type">打药</span>
                            </div>
                        </div>
                        <div class="plan-details">
                            <div class="detail-row">
                                <span class="detail-label">项目：</span>
                                <span class="detail-value">大厅水培植物 | 一号分区</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">基地/地块：</span>
                                <span class="detail-value">大厅水培植物 | 一号分区 | 一号基地(水培区 | 一号地块)</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">作物及品种：</span>
                                <span class="detail-value">水仙花(1号)</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">种植周期：</span>
                                <span class="detail-value">水仙花(2025-08-12~2025-08-15)</span>
                            </div>
                        </div>
                        <div class="plan-expand">
                            <span>展开</span>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div class="plan-actions">
                            <button class="btn btn-danger">结束</button>
                            <button class="btn btn-primary">查看农事活动</button>
                        </div>
                    </div>
                </div>

                <!-- 悬浮添加按钮 -->
                <div class="float-action-btn">
                    <i class="fas fa-plus"></i>
                </div>
            </div>
        `
    },
    
    addFarmActivity: {
        title: '添加农事活动',
        subtitle: '创建新的农事活动',
        content: `
            <div class="mobile-page addFarmActivity-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="goBack()"><i class="fas fa-arrow-left"></i></button>
                    <h1>添加农事活动</h1>
                </div>
                <div class="mobile-content">
                    <!-- AI语音输入提示 -->
                    <div class="ai-voice-tip">
                        <div class="tip-content">
                            <i class="fas fa-microphone-alt"></i>
                            <span>点击下方AI按钮，语音输入表单信息</span>
                        </div>
                        <div class="tip-examples">
                            <span class="example-title">示例：</span>
                            <span class="example-text">"我要为大厅水培植物基地的水仙花安排打药活动，时间是明天上午9点到11点，负责人是王成龙"</span>
                        </div>
                    </div>
                    
                    <div class="form-container">
                        <!-- 种植计划 -->
                        <div class="form-group">
                            <label class="form-label required">种植计划:</label>
                            <div class="form-input-wrapper">
                                <input type="text" class="form-input" id="plantingPlan" placeholder="请选择">
                                <i class="fas fa-chevron-down"></i>
                            </div>
                        </div>
                        
                        <!-- 基地地块 -->
                        <div class="form-group">
                            <label class="form-label required">基地地块</label>
                            <input type="text" class="form-input" id="basePlot" placeholder="">
                        </div>
                        
                        <!-- 作物 -->
                        <div class="form-group">
                            <label class="form-label required">作物:</label>
                            <input type="text" class="form-input" id="crop" placeholder="">
                        </div>
                        
                        <!-- 农事类型 -->
                        <div class="form-group">
                            <label class="form-label required">农事类型:</label>
                            <div class="form-input-wrapper">
                                <input type="text" class="form-input" id="activityType" placeholder="请选择">
                                <button class="add-type-btn">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- 活动名称 -->
                        <div class="form-group">
                            <label class="form-label required">活动名称:</label>
                            <input type="text" class="form-input" id="activityName" placeholder="请输入">
                        </div>
                        
                        <!-- 活动时间 -->
                        <div class="form-group">
                            <label class="form-label required">活动时间:</label>
                            <div class="time-input-group">
                                <input type="text" class="form-input" id="startTime" placeholder="开始时间">
                                <span class="time-separator">至</span>
                                <input type="text" class="form-input" id="endTime" placeholder="结束时间">
                            </div>
                        </div>
                        
                        <!-- 负责人 -->
                        <div class="form-group">
                            <label class="form-label required">负责人:</label>
                            <div class="form-input-wrapper">
                                <input type="text" class="form-input" id="personInCharge" placeholder="请选择">
                                <i class="fas fa-chevron-down"></i>
                            </div>
                        </div>
                        
                        <!-- 是否用工 -->
                        <div class="form-group">
                            <label class="form-label">是否用工:</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="useLabor" class="toggle-input">
                                <label for="useLabor" class="toggle-label"></label>
                            </div>
                        </div>
                        
                        <!-- 备注 -->
                        <div class="form-group">
                            <label class="form-label">备注:</label>
                            <textarea class="form-textarea" id="remarks" placeholder="请输入内容"></textarea>
                        </div>
                    </div>
                </div>
                
                <!-- AI语音输入按钮 -->
                <div class="ai-voice-button" onclick="startVoiceInput()">
                    <i class="fas fa-microphone-alt"></i>
                    <span class="ai-text">AI</span>
                </div>
                
                <!-- 底部确认按钮 -->
                <div class="mobile-footer">
                    <button class="btn btn-confirm">确定</button>
                </div>
                
                <!-- AI语音识别弹窗 -->
                <div class="ai-voice-modal" id="aiVoiceModal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>AI语音识别</h3>
                            <button class="close-btn" onclick="closeVoiceModal()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="voice-recording" id="voiceRecording">
                                <div class="recording-animation">
                                    <div class="wave-container">
                                        <div class="wave"></div>
                                        <div class="wave"></div>
                                        <div class="wave"></div>
                                    </div>
                                </div>
                                <div class="recording-text">正在录音，请说话...</div>
                                <div class="recording-time" id="recordingTime">00:00</div>
                                
                                <!-- 实时回显文字 -->
                                <div class="realtime-text-container">
                                    <div class="realtime-text" id="realtimeText"></div>
                                </div>
                                
                                <!-- 录音控制按钮 -->
                                <div class="recording-controls">
                                    <button class="btn btn-pause" id="pauseBtn" onclick="pauseRecording()">
                                        <i class="fas fa-pause"></i>
                                        <span>暂停</span>
                                    </button>
                                    <button class="btn btn-continue" id="continueBtn" onclick="continueRecording()" style="display: none;">
                                        <i class="fas fa-play"></i>
                                        <span>继续</span>
                                    </button>
                                    <button class="btn btn-finish" id="finishBtn" onclick="finishRecording()">
                                        完成
                                    </button>
                                </div>
                            </div>
                            <div class="voice-result" id="voiceResult" style="display: none;">
                                <div class="result-header">
                                    <i class="fas fa-edit"></i>
                                    <span>识别结果</span>
                                </div>
                                <div class="result-tip">
                                    <i class="fas fa-lightbulb"></i>
                                    <span>你还可以编辑修改文字内容</span>
                                </div>
                                <div class="result-text-container">
                                    <textarea class="result-text-editable" id="resultTextEditable" placeholder="AI识别的文本将显示在这里，您可以进行编辑..."></textarea>
                                </div>
                                <div class="result-actions">
                                    <button class="btn btn-secondary" onclick="reRecord()">
                                        <i class="fas fa-microphone"></i>
                                        重新录音
                                    </button>
                                    <button class="btn btn-primary" onclick="confirmResult()">
                                        <i class="fas fa-check"></i>
                                        确认使用
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- AI智能解析过渡弹窗 -->
                <div class="ai-processing-modal" id="aiProcessingModal">
                    <div class="processing-content">
                        <div class="modal-header">
                            <h3>AI智能解析中</h3>
                            <button class="close-btn" onclick="hideAIProcessing()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="processing-body">
                            <ul class="timeline" id="processingTimeline">
                                <li class="step"><span class="dot"></span><span class="label">语音转文字</span></li>
                                <li class="step"><span class="dot"></span><span class="label">意图理解</span></li>
                                <li class="step"><span class="dot"></span><span class="label">实体抽取</span></li>
                                <li class="step"><span class="dot"></span><span class="label">表单映射</span></li>
                                <li class="step"><span class="dot"></span><span class="label">完成</span></li>
                            </ul>
                            <div class="variables-card">
                                <div class="vc-title"><i class="fas fa-list"></i> AI识别到的变量</div>
                                <div class="variables-list" id="extractedVariables">
                                    <!-- 变量结果将由JS填充 -->
                                </div>
                            </div>
                            <div class="countdown-section">
                                <div class="countdown-text">即将自动填充表单</div>
                                <div class="countdown-timer" id="countdownTimer">3</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    
    productList: {
        title: '商品列表',
        subtitle: '管理所有商品',
        content: `
            <div class="mobile-page">
                <div class="mobile-header">
                    <h1>商品列表</h1>
                    <div class="subtitle">管理所有商品</div>
                </div>
                <div class="mobile-content">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">商品管理</div>
                            <button class="btn" onclick="loadPage('product-add')">添加商品</button>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="list-item">
                            <div class="list-item-icon">
                                <i class="fas fa-tshirt"></i>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">时尚T恤</div>
                                <div class="list-item-subtitle">库存: 156件 | 价格: ¥89</div>
                            </div>
                            <div class="list-item-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                        <div class="list-item">
                            <div class="list-item-icon">
                                <i class="fas fa-shoe-prints"></i>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">运动鞋</div>
                                <div class="list-item-subtitle">库存: 89双 | 价格: ¥299</div>
                            </div>
                            <div class="list-item-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                        <div class="list-item">
                            <div class="list-item-icon">
                                <i class="fas fa-mobile-alt"></i>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">智能手机</div>
                                <div class="list-item-subtitle">库存: 23台 | 价格: ¥2999</div>
                            </div>
                            <div class="list-item-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                        <div class="list-item">
                            <div class="list-item-icon">
                                <i class="fas fa-laptop"></i>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">笔记本电脑</div>
                                <div class="list-item-subtitle">库存: 12台 | 价格: ¥5999</div>
                            </div>
                            <div class="list-item-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    
    productAdd: {
        title: '添加商品',
        subtitle: '创建新商品',
        content: `
            <div class="mobile-page">
                <div class="mobile-header">
                    <h1>添加商品</h1>
                    <div class="subtitle">创建新商品</div>
                </div>
                <div class="mobile-content">
                    <div class="card">
                        <div class="form-group">
                            <label class="form-label">商品图片</label>
                            <div style="text-align: center; padding: 20px; border: 2px dashed #ddd; border-radius: 8px;">
                                <i class="fas fa-camera" style="font-size: 32px; color: #ccc; margin-bottom: 10px;"></i>
                                <div style="color: #666;">点击上传商品图片</div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">商品名称</label>
                            <input type="text" class="form-input" placeholder="请输入商品名称">
                        </div>
                        <div class="form-group">
                            <label class="form-label">商品分类</label>
                            <select class="form-input">
                                <option>请选择分类</option>
                                <option>服装</option>
                                <option>数码</option>
                                <option>家居</option>
                                <option>美妆</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">商品价格</label>
                            <input type="number" class="form-input" placeholder="请输入价格">
                        </div>
                        <div class="form-group">
                            <label class="form-label">库存数量</label>
                            <input type="number" class="form-input" placeholder="请输入库存数量">
                        </div>
                        <div class="form-group">
                            <label class="form-label">商品描述</label>
                            <textarea class="form-input" rows="4" placeholder="请输入商品描述"></textarea>
                        </div>
                        <button class="btn" style="width: 100%;">创建商品</button>
                    </div>
                </div>
            </div>
        `
    },
    
    orderList: {
        title: '订单列表',
        subtitle: '查看所有订单',
        content: `
            <div class="mobile-page">
                <div class="mobile-header">
                    <h1>订单列表</h1>
                    <div class="subtitle">查看所有订单</div>
                </div>
                <div class="mobile-content">
                    <div class="card">
                        <div class="list-item" onclick="loadPage('order-detail')">
                            <div class="list-item-icon">
                                <i class="fas fa-shopping-bag"></i>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">订单 #20231201001</div>
                                <div class="list-item-subtitle">张三 | ¥299 | 待发货</div>
                            </div>
                            <div class="list-item-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                        <div class="list-item">
                            <div class="list-item-icon">
                                <i class="fas fa-shopping-bag"></i>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">订单 #20231201002</div>
                                <div class="list-item-subtitle">李四 | ¥5999 | 已发货</div>
                            </div>
                            <div class="list-item-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                        <div class="list-item">
                            <div class="list-item-icon">
                                <i class="fas fa-shopping-bag"></i>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">订单 #20231201003</div>
                                <div class="list-item-subtitle">王五 | ¥89 | 已完成</div>
                            </div>
                            <div class="list-item-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                        <div class="list-item">
                            <div class="list-item-icon">
                                <i class="fas fa-shopping-bag"></i>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">订单 #20231201004</div>
                                <div class="list-item-subtitle">赵六 | ¥2999 | 待付款</div>
                            </div>
                            <div class="list-item-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    
    orderDetail: {
        title: '订单详情',
        subtitle: '订单 #20231201001',
        content: `
            <div class="mobile-page">
                <div class="mobile-header">
                    <h1>订单详情</h1>
                    <div class="subtitle">订单 #20231201001</div>
                </div>
                <div class="mobile-content">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">订单状态</div>
                        </div>
                        <div style="padding: 15px 0;">
                            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                <div style="width: 20px; height: 20px; background: #28a745; border-radius: 50%; margin-right: 15px;"></div>
                                <div>
                                    <div style="font-weight: 500;">订单已确认</div>
                                    <div style="font-size: 12px; color: #666;">2023-12-01 10:30</div>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                <div style="width: 20px; height: 20px; background: #28a745; border-radius: 50%; margin-right: 15px;"></div>
                                <div>
                                    <div style="font-weight: 500;">付款成功</div>
                                    <div style="font-size: 12px; color: #666;">2023-12-01 10:35</div>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center;">
                                <div style="width: 20px; height: 20px; background: #ffc107; border-radius: 50%; margin-right: 15px;"></div>
                                <div>
                                    <div style="font-weight: 500;">待发货</div>
                                    <div style="font-size: 12px; color: #666;">等待处理中</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">商品信息</div>
                        </div>
                        <div class="list-item">
                            <div class="list-item-icon">
                                <i class="fas fa-tshirt"></i>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">时尚T恤</div>
                                <div class="list-item-subtitle">数量: 1件 | 价格: ¥299</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">收货信息</div>
                        </div>
                        <div style="padding: 15px 0;">
                            <div style="margin-bottom: 10px;">
                                <strong>收货人:</strong> 张三
                            </div>
                            <div style="margin-bottom: 10px;">
                                <strong>电话:</strong> 138****8888
                            </div>
                            <div>
                                <strong>地址:</strong> 北京市朝阳区某某街道某某小区1号楼101室
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">订单金额</div>
                        </div>
                        <div style="padding: 15px 0;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span>商品金额:</span>
                                <span>¥299</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span>运费:</span>
                                <span>¥0</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 18px; border-top: 1px solid #eee; padding-top: 10px;">
                                <span>总计:</span>
                                <span>¥299</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    
    aiServiceEffect: {
        title: '农事方案库',
        subtitle: '我的方案',
        content: `
            <div class="mobile-page aiServiceEffect-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="goBack()"><i class="fas fa-arrow-left"></i></button>
                    <h1>农事方案库</h1>
                    <div class="subtitle">我的方案</div>
                </div>
                <div class="mobile-content">
                    <!-- 主导航标签 -->
                    <div class="plan-tabs">
                        <div class="plan-tab">
                            <i class="fas fa-book"></i>
                            <span>农事方案库</span>
                        </div>
                        <div class="plan-tab active">
                            <i class="fas fa-file-alt"></i>
                            <span>我的方案</span>
                        </div>
                    </div>
                    
                    <!-- 方案卡片 -->
                    <div class="plan-card">
                        <div class="plan-header">
                            <div class="plan-title">水仙花 | 8月管理1号方案</div>
                        </div>
                        <div class="plan-details">
                            <div class="detail-row">
                                <span class="detail-label">作物种类:</span>
                                <span class="detail-value">水仙花</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">作物品种:</span>
                                <span class="detail-value">1号</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">种植面积:</span>
                                <span class="detail-value">1亩</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">指导专家:</span>
                                <span class="detail-value"></span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">所属单位:</span>
                                <span class="detail-value"></span>
                            </div>
                        </div>
                        <div class="plan-actions">
                            <button class="btn btn-primary">提交官方认证</button>
                        </div>
                    </div>
                    
                    <!-- 底部提示 -->
                    <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                        <i class="fas fa-robot" style="color: #0aa06e; margin-right: 5px;"></i>
                        没有更多了
                    </div>
                </div>

                <!-- 悬浮添加按钮 -->
                <div class="float-action-btn">
                    <i class="fas fa-plus"></i>
                </div>
            </div>
        `
    },
    
    farmServiceRecord: {
        title: '新建农事方案',
        subtitle: '基础信息',
        content: `
            <div class="mobile-page newFarmPlan-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="goBack()"><i class="fas fa-arrow-left"></i></button>
                    <h1>新建农事方案</h1>
                    <div class="header-actions">
                        <i class="fas fa-ellipsis-v"></i>
                        <i class="fas fa-bullseye"></i>
                    </div>
                </div>
                
                <!-- 进度指示器 -->
                <div class="progress-indicator">
                    <div class="progress-step active">
                        <span class="step-number">1</span>
                        <span class="step-text">基础信息</span>
                    </div>
                    <div class="progress-arrow">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="progress-step">
                        <span class="step-number">2</span>
                        <span class="step-text">方案计划</span>
                    </div>
                </div>
                
                <div class="mobile-content">
                    <!-- AI语音输入提示 -->
                    <div class="ai-voice-tip">
                        <div class="tip-content">
                            <i class="fas fa-microphone-alt"></i>
                            <span>点击下方AI按钮，语音输入表单信息</span>
                        </div>
                        <div class="tip-examples">
                            <span class="example-title">示例：</span>
                            <span class="example-text">"我要为大厅水培植物基地的水仙花安排打药活动，时间是明天上午9点到11点，负责人是王成龙" 或 "我要创建一个水仙花种植方案，方案名称是8月管理1号方案，所在区域是大厅水培植物基地，种植面积1亩，预计亩均产量500公斤，预计亩均成本2000元，预计亩均收入3000元，指导专家是张教授，所属单位是农业技术推广站"</span>
                        </div>
                    </div>
                    
                    <div class="form-container">
                        <!-- 方案名称 -->
                        <div class="form-group">
                            <label class="form-label required">方案名称</label>
                            <input type="text" class="form-input" id="planName" placeholder="请输入">
                        </div>
                        
                        <!-- 所在地域 -->
                        <div class="form-group">
                            <label class="form-label required">所在地域</label>
                            <div class="form-input-wrapper">
                                <input type="text" class="form-input" id="location" placeholder="请选择区域">
                                <i class="fas fa-chevron-down"></i>
                            </div>
                        </div>
                        
                        <!-- 种植作物 -->
                        <div class="form-group">
                            <label class="form-label required">种植作物</label>
                            <div class="form-input-wrapper">
                                <input type="text" class="form-input" id="cropType" placeholder="请选择">
                                <button class="add-crop-btn">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- 作物品种 -->
                        <div class="form-group">
                            <label class="form-label required">作物品种</label>
                            <input type="text" class="form-input" id="cropVariety" placeholder="请输入">
                        </div>
                        
                        <!-- 种植周期 -->
                        <div class="form-group">
                            <label class="form-label required">种植周期</label>
                            <div class="time-input-group">
                                <input type="text" class="form-input" id="startTime" placeholder="开始时间">
                                <span class="time-separator">至</span>
                                <input type="text" class="form-input" id="endTime" placeholder="结束时间">
                            </div>
                        </div>
                        
                        <!-- 种植面积 -->
                        <div class="form-group">
                            <label class="form-label required">种植面积</label>
                            <input type="text" class="form-input" id="plantingArea" placeholder="请输入">
                        </div>
                        
                        <!-- 预计亩均产量 -->
                        <div class="form-group">
                            <label class="form-label required">预计亩均产量</label>
                            <div class="form-input-wrapper">
                                <input type="text" class="form-input" id="expectedYield" placeholder="请输入">
                                <span class="unit-text">kg</span>
                            </div>
                        </div>
                        
                        <!-- 预计亩均成本 -->
                        <div class="form-group">
                            <label class="form-label required">预计亩均成本</label>
                            <div class="form-input-wrapper">
                                <input type="text" class="form-input" id="expectedCost" placeholder="请输入">
                                <span class="unit-text">元</span>
                            </div>
                        </div>
                        
                        <!-- 预计亩均收入 -->
                        <div class="form-group">
                            <label class="form-label required">预计亩均收入</label>
                            <div class="form-input-wrapper">
                                <input type="text" class="form-input" id="expectedIncome" placeholder="请输入">
                                <span class="unit-text">元</span>
                            </div>
                        </div>
                        
                        <!-- 指导专家 -->
                        <div class="form-group">
                            <label class="form-label required">指导专家</label>
                            <input type="text" class="form-input" id="expert" placeholder="请输入">
                        </div>
                        
                        <!-- 所属单位 -->
                        <div class="form-group">
                            <label class="form-label required">所属单位</label>
                            <input type="text" class="form-input" id="organization" placeholder="请输入">
                        </div>
                    </div>
                </div>
                
                <!-- AI语音输入按钮 -->
                <div class="ai-voice-button" onclick="startVoiceInput()">
                    <i class="fas fa-microphone-alt"></i>
                    <span class="ai-text">AI</span>
                </div>
                
                <!-- 底部按钮 -->
                <div class="mobile-footer">
                    <button class="btn btn-next" onclick="loadPage('farmPlanStep2')">下一步</button>
                </div>
                
                <!-- AI语音识别弹窗 -->
                <div class="ai-voice-modal" id="aiVoiceModal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>AI语音识别</h3>
                            <button class="close-btn" onclick="closeVoiceModal()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="voice-recording" id="voiceRecording">
                                <div class="recording-animation">
                                    <div class="wave-container">
                                        <div class="wave"></div>
                                        <div class="wave"></div>
                                        <div class="wave"></div>
                                    </div>
                                </div>
                                <div class="recording-text">正在录音，请说话...</div>
                                <div class="recording-time" id="recordingTime">00:00</div>
                                
                                <!-- 实时回显文字 -->
                                <div class="realtime-text-container">
                                    <div class="realtime-text" id="realtimeText"></div>
                                </div>
                                
                                <!-- 录音控制按钮 -->
                                <div class="recording-controls">
                                    <button class="btn btn-pause" id="pauseBtn" onclick="pauseRecording()">
                                        <i class="fas fa-pause"></i>
                                        <span>暂停</span>
                                    </button>
                                    <button class="btn btn-continue" id="continueBtn" onclick="continueRecording()" style="display: none;">
                                        <i class="fas fa-play"></i>
                                        <span>继续</span>
                                    </button>
                                    <button class="btn btn-finish" id="finishBtn" onclick="finishRecording()">
                                        完成
                                    </button>
                                </div>
                            </div>
                            <div class="voice-result" id="voiceResult" style="display: none;">
                                <div class="result-header">
                                    <i class="fas fa-edit"></i>
                                    <span>识别结果</span>
                                </div>
                                <div class="result-tip">
                                    <i class="fas fa-lightbulb"></i>
                                    <span>你还可以编辑修改文字内容</span>
                                </div>
                                <div class="result-text-container">
                                    <textarea class="result-text-editable" id="resultTextEditable" placeholder="AI识别的文本将显示在这里，您可以进行编辑..."></textarea>
                                </div>
                                <div class="result-actions">
                                    <button class="btn btn-secondary" onclick="reRecord()">
                                        <i class="fas fa-microphone"></i>
                                        重新录音
                                    </button>
                                    <button class="btn btn-primary" onclick="confirmResult()">
                                        <i class="fas fa-check"></i>
                                        确认使用
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- AI智能解析过渡弹窗 -->
                <div class="ai-processing-modal" id="aiProcessingModal">
                    <div class="processing-content">
                        <div class="modal-header">
                            <h3>AI智能解析中</h3>
                            <button class="close-btn" onclick="hideAIProcessing()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="processing-body">
                            <ul class="timeline" id="processingTimeline">
                                <li class="step"><span class="dot"></span><span class="label">语音转文字</span></li>
                                <li class="step"><span class="dot"></span><span class="label">意图理解</span></li>
                                <li class="step"><span class="dot"></span><span class="label">实体抽取</span></li>
                                <li class="step"><span class="dot"></span><span class="label">表单映射</span></li>
                                <li class="step"><span class="dot"></span><span class="label">完成</span></li>
                            </ul>
                            <div class="variables-card">
                                <div class="vc-title"><i class="fas fa-list"></i> AI识别到的变量</div>
                                <div class="variables-list" id="extractedVariables">
                                    <!-- 变量结果将由JS填充 -->
                                </div>
                            </div>
                            <div class="countdown-section">
                                <div class="countdown-text">即将自动填充表单</div>
                                <div class="countdown-timer" id="countdownTimer">3</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    
    farmPlanStep2: {
        title: '新建农事方案',
        subtitle: '方案计划',
        content: `
            <div class="mobile-page newFarmPlan-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="goBack()"><i class="fas fa-arrow-left"></i></button>
                    <h1>新建农事方案</h1>
                    <div class="header-actions">
                        <i class="fas fa-ellipsis-v"></i>
                        <i class="fas fa-bullseye"></i>
                    </div>
                </div>
                
                <!-- 进度指示器 -->
                <div class="progress-indicator">
                    <div class="progress-step completed">
                        <span class="step-number">1</span>
                        <span class="step-text">基础信息</span>
                    </div>
                    <div class="progress-arrow">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="progress-step active">
                        <span class="step-number">2</span>
                        <span class="step-text">方案计划</span>
                    </div>
                </div>
                
                <div class="mobile-content">
                    <!-- AI语音输入提示 -->
                    <div class="ai-voice-tip">
                        <div class="tip-content">
                            <i class="fas fa-microphone-alt"></i>
                            <span>点击下方AI按钮，语音添加农事计划</span>
                        </div>
                        <div class="tip-examples">
                            <span class="example-title">示例：</span>
                            <span class="example-text">"我要添加一个打药计划，时间是从8月18日到8月20日，农事类型是打药，活动名称是第一季度打药作业活动，作物是冬小麦，建议注意天气条件进行打药作业"</span>
                        </div>
                    </div>
                    
                    <!-- 农事方案计划标题 -->
                    <div class="plan-section-header">
                        <h3>农事方案计划</h3>
                        <button class="add-plan-btn" onclick="startVoiceInput()">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    
                    <!-- 方案计划卡片 -->
                    <div class="plan-card">
                        <div class="plan-card-header">
                            <div class="plan-date">
                                <i class="fas fa-clock"></i>
                                <span>当年08月18日~当年08月20日</span>
                            </div>
                            <div class="plan-options">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                        <div class="plan-card-content">
                            <div class="plan-detail-item">
                                <span class="detail-label">农事类型:</span>
                                <span class="detail-value">打药</span>
                            </div>
                            <div class="plan-detail-item">
                                <span class="detail-label">活动名称:</span>
                                <span class="detail-value">第一季度 | 打药作业活动</span>
                            </div>
                            <div class="plan-detail-item">
                                <span class="detail-label">作物:</span>
                                <span class="detail-value">冬小麦</span>
                            </div>
                            <div class="plan-detail-item">
                                <span class="detail-label">建议:</span>
                                <span class="detail-value">打药作业</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- AI语音输入按钮 -->
                <div class="ai-voice-button" onclick="startVoiceInput()">
                    <i class="fas fa-microphone-alt"></i>
                    <span class="ai-text">AI</span>
                </div>
                
                <!-- 底部按钮 -->
                <div class="mobile-footer">
                    <div class="footer-buttons">
                        <button class="btn btn-prev" onclick="loadPage('farmServiceRecord')">上一步</button>
                        <button class="btn btn-complete">完成</button>
                    </div>
                </div>
                
                <!-- AI语音识别弹窗 -->
                <div class="ai-voice-modal" id="aiVoiceModal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>AI语音识别</h3>
                            <button class="close-btn" onclick="closeVoiceModal()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="voice-recording" id="voiceRecording">
                                <div class="recording-animation">
                                    <div class="wave-container">
                                        <div class="wave"></div>
                                        <div class="wave"></div>
                                        <div class="wave"></div>
                                    </div>
                                </div>
                                <div class="recording-text">正在录音，请说话...</div>
                                <div class="recording-time" id="recordingTime">00:00</div>
                                
                                <!-- 实时回显文字 -->
                                <div class="realtime-text-container">
                                    <div class="realtime-text" id="realtimeText"></div>
                                </div>
                                
                                <!-- 录音控制按钮 -->
                                <div class="recording-controls">
                                    <button class="btn btn-pause" id="pauseBtn" onclick="pauseRecording()">
                                        <i class="fas fa-pause"></i>
                                        <span>暂停</span>
                                    </button>
                                    <button class="btn btn-continue" id="continueBtn" onclick="continueRecording()" style="display: none;">
                                        <i class="fas fa-play"></i>
                                        <span>继续</span>
                                    </button>
                                    <button class="btn btn-finish" id="finishBtn" onclick="finishRecording()">
                                        完成
                                    </button>
                                </div>
                            </div>
                            <div class="voice-result" id="voiceResult" style="display: none;">
                                <div class="result-header">
                                    <i class="fas fa-edit"></i>
                                    <span>识别结果</span>
                                </div>
                                <div class="result-tip">
                                    <i class="fas fa-lightbulb"></i>
                                    <span>你还可以编辑修改文字内容</span>
                                </div>
                                <div class="result-text-container">
                                    <textarea class="result-text-editable" id="resultTextEditable" placeholder="AI识别的文本将显示在这里，您可以进行编辑..."></textarea>
                                </div>
                                <div class="result-actions">
                                    <button class="btn btn-secondary" onclick="reRecord()">
                                        <i class="fas fa-microphone"></i>
                                        重新录音
                                    </button>
                                    <button class="btn btn-primary" onclick="confirmResult()">
                                        <i class="fas fa-check"></i>
                                        确认使用
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- AI智能解析过渡弹窗 -->
                <div class="ai-processing-modal" id="aiProcessingModal">
                    <div class="processing-content">
                        <div class="modal-header">
                            <h3>AI智能解析中</h3>
                            <button class="close-btn" onclick="hideAIProcessing()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="processing-body">
                            <ul class="timeline" id="processingTimeline">
                                <li class="step"><span class="dot"></span><span class="label">语音转文字</span></li>
                                <li class="step"><span class="dot"></span><span class="label">意图理解</span></li>
                                <li class="step"><span class="dot"></span><span class="label">实体抽取</span></li>
                                <li class="step"><span class="dot"></span><span class="label">计划创建</span></li>
                                <li class="step"><span class="dot"></span><span class="label">完成</span></li>
                            </ul>
                            <div class="variables-card">
                                <div class="vc-title"><i class="fas fa-list"></i> AI识别到的变量</div>
                                <div class="variables-list" id="extractedVariables">
                                    <!-- 变量结果将由JS填充 -->
                                </div>
                            </div>
                            <div class="countdown-section">
                                <div class="countdown-text">即将自动创建农事计划</div>
                                <div class="countdown-timer" id="countdownTimer">3</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    
    userAnalytics: {
        title: '用户分析',
        subtitle: '用户行为数据分析',
        content: `
            <div class="mobile-page">
                <div class="mobile-header">
                    <h1>用户分析</h1>
                    <div class="subtitle">用户行为数据分析</div>
                </div>
                <div class="mobile-content">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">1,234</div>
                            <div class="stat-label">总用户数</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">567</div>
                            <div class="stat-label">活跃用户</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">89.2%</div>
                            <div class="stat-label">用户留存率</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">4.5</div>
                            <div class="stat-label">平均使用时长(小时)</div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">用户增长</div>
                        </div>
                        <div style="height: 200px; display: flex; align-items: center; justify-content: center; color: #666;">
                            <div style="text-align: center;">
                                <i class="fas fa-chart-area" style="font-size: 48px; margin-bottom: 10px; color: #ccc;"></i>
                                <div>用户增长趋势图</div>
                                <div style="font-size: 12px; margin-top: 5px;">（演示用图表占位）</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">用户分布</div>
                        </div>
                        <div class="list-item">
                            <div class="list-item-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">北京</div>
                                <div class="list-item-subtitle">用户数: 234人 (19%)</div>
                            </div>
                        </div>
                        <div class="list-item">
                            <div class="list-item-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">上海</div>
                                <div class="list-item-subtitle">用户数: 189人 (15%)</div>
                            </div>
                        </div>
                        <div class="list-item">
                            <div class="list-item-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">广州</div>
                                <div class="list-item-subtitle">用户数: 156人 (13%)</div>
                            </div>
                        </div>
                        <div class="list-item">
                            <div class="list-item-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">深圳</div>
                                <div class="list-item-subtitle">用户数: 145人 (12%)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },

    fieldWorkstation: {
        title: '田间工作站',
        subtitle: '投入品使用成效核查配置',
        content: `
            <div class="mobile-page fieldWorkstation-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="goBack()"><i class="fas fa-arrow-left"></i></button>
                    <h1>投入品使用成效核查配置</h1>
                </div>
                <div class="mobile-content">
                    <!-- 配置开关 -->
                    <div class="card">
                        <div class="config-row">
                            <span class="config-label">投入品使用成效核查配置开关</span>
                            <div class="config-switch active">
                                <span>已开启</span>
                                <div class="switch-toggle"></div>
                            </div>
                        </div>
                    </div>

                    <!-- 核查方式 -->
                    <div class="card">
                        <div class="section-title">投入品使用结果核查方式</div>
                        <div class="radio-group">
                            <div class="radio-item active">
                                <div class="radio-circle"></div>
                                <span>随机生成多点监测</span>
                            </div>
                            <div class="radio-item">
                                <div class="radio-circle"></div>
                                <span>田间摄像头拍照</span>
                            </div>
                        </div>
                        <div class="selected-method">
                            <i class="fas fa-circle"></i>
                            <span>随机生成多点监测</span>
                        </div>
                    </div>

                    <!-- 土壤肥力检测要求 -->
                    <div class="card">
                        <div class="section-title">
                            <i class="fas fa-circle" style="color: #0aa06e; font-size: 8px; margin-right: 8px;"></i>
                            土壤肥力检测要求
                            <button class="ai-btn" onclick="showAIDialog('soil')">
                                <i class="fas fa-robot"></i>
                                AI设定要求
                            </button>
                        </div>
                        
                        <div class="config-section">
                            <div class="config-text">施肥农事活动结束后,第 <input type="number" class="config-input" value="7"> 天,进行 土壤肥力检测</div>
                            
                            <div class="config-row">
                                <span class="config-label">土壤测肥任务开始时间:</span>
                                <div class="time-input">
                                    <span>选择时间</span>
                                    <i class="fas fa-clock"></i>
                                </div>
                            </div>
                            
                            <div class="config-row">
                                <span class="config-label">土壤测肥任务截止时限:</span>
                                <div class="time-input">
                                    <input type="number" class="config-input" value="0" style="width: 40px;">
                                    <span>小时</span>
                                </div>
                            </div>
                            
                            <div class="config-row">
                                <span class="config-label">生成土壤测肥点位数量</span>
                                <div class="time-input">
                                    <input type="number" class="config-input" style="width: 40px;">
                                    <span>个</span>
                                </div>
                            </div>
                            
                            <div class="config-row">
                                <span class="config-label">土壤测肥点位有效区域</span>
                                <div class="time-input">
                                    <input type="number" class="config-input" style="width: 40px;">
                                    <span>米(以内)</span>
                                </div>
                            </div>
                            
                            <div class="config-row">
                                <span class="config-label">肥力指标</span>
                                <button class="btn-custom">自定义指标+</button>
                            </div>
                            
                            <div class="indicator-list">
                                <div class="indicator-item">
                                    <span>氮</span>
                                    <div class="switch-toggle"></div>
                                </div>
                                <div class="indicator-item">
                                    <span>磷</span>
                                    <div class="switch-toggle"></div>
                                </div>
                                <div class="indicator-item">
                                    <span>钾</span>
                                    <div class="switch-toggle"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 作物长势拍照要求 -->
                    <div class="card">
                        <div class="section-title">
                            <i class="fas fa-circle" style="color: #0aa06e; font-size: 8px; margin-right: 8px;"></i>
                            作物长势拍照要求
                            <button class="ai-btn" onclick="showAIDialog('crop')">
                                <i class="fas fa-robot"></i>
                                AI设定要求
                            </button>
                        </div>
                        
                        <div class="config-section">
                            <div class="config-text">农事活动结束后,第 <input type="number" class="config-input" value="0"> 天,进行作物 长势拍照</div>
                            
                            <div class="config-row">
                                <span class="config-label">长势拍照任务开始时间:</span>
                                <div class="time-input">
                                    <span>07:00</span>
                                    <i class="fas fa-clock"></i>
                                </div>
                            </div>
                            
                            <div class="config-row">
                                <span class="config-label">长势拍照任务截止时限:</span>
                                <div class="time-input">
                                    <input type="number" class="config-input" value="1" style="width: 40px;">
                                    <span>小时</span>
                                </div>
                            </div>
                            
                            <div class="config-row">
                                <span class="config-label">生成拍照打卡点位数量</span>
                                <div class="time-input">
                                    <input type="number" class="config-input" value="2" style="width: 40px;">
                                    <span>个</span>
                                </div>
                            </div>
                            
                            <div class="config-row">
                                <span class="config-label">拍照打卡点位有效区域</span>
                                <div class="time-input">
                                    <input type="number" class="config-input" value="20" style="width: 40px;">
                                    <span>米(以内)</span>
                                </div>
                            </div>
                            
                            <div class="config-row">
                                <span class="config-label">每个点位拍照数量</span>
                                <div class="time-input">
                                    <input type="number" class="config-input" value="1" style="width: 40px;">
                                    <span>张(含)以上</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 底部按钮 -->
                <div class="mobile-footer action-footer">
                    <button class="btn btn-secondary">取消</button>
                    <button class="btn">确定</button>
                </div>

                <!-- AI设定弹窗 -->
                <div class="ai-dialog" id="aiDialog">
                    <div class="ai-dialog-content">
                        <div class="ai-dialog-header">
                            <h3><i class="fas fa-robot"></i> AI智能设定</h3>
                            <button class="ai-close" onclick="hideAIDialog()">×</button>
                        </div>
                        <div class="ai-dialog-body">
                            <div class="ai-section">
                                <h4>基础信息</h4>
                                <div class="ai-form-group">
                                    <label>作物类型:</label>
                                    <input type="text" id="cropType" value="小麦" disabled class="disabled-input">
                                </div>
                                <div class="ai-form-group">
                                    <label>地理坐标:</label>
                                    <input type="text" id="location" value="商丘市 柘城县 牛城乡 大运村" disabled class="disabled-input">
                                </div>
                                <div class="ai-form-group">
                                    <label>种植方案:</label>
                                    <select id="plantingPlan">
                                        <option value="standard">标准种植</option>
                                        <option value="intensive">密集种植</option>
                                        <option value="organic">有机种植</option>
                                    </select>
                                </div>
                            </div>
                            <div class="ai-section">
                                <h4>AI分析结果</h4>
                                <div class="ai-analysis" id="aiAnalysis">
                                    <div class="ai-loading">
                                        <i class="fas fa-spinner fa-spin"></i>
                                        正在分析...
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ai-dialog-footer">
                            <button class="btn btn-secondary" onclick="hideAIDialog()">取消</button>
                            <button class="btn" onclick="applyAISettings()">应用设定</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    },

    farmCalendar: {
        title: '农事日历',
        subtitle: '农事活动管理',
        content: `
            <div class="mobile-page farmCalendar-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="goBack()"><i class="fas fa-arrow-left"></i></button>
                    <h1>农事日历</h1>
                </div>
                <div class="mobile-content">
                    <!-- 日历导航 -->
                    <div class="calendar-nav">
                        <div class="calendar-header">
                            <i class="fas fa-chevron-left"></i>
                            <span>2025/08</span>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                        
                        <!-- 星期标题 -->
                        <div class="weekdays">
                            <div class="weekday">日</div>
                            <div class="weekday">一</div>
                            <div class="weekday">二</div>
                            <div class="weekday">三</div>
                            <div class="weekday">四</div>
                            <div class="weekday">五</div>
                            <div class="weekday">六</div>
                        </div>
                        
                        <!-- 日期显示 -->
                        <div class="date-row">
                            <div class="date-item">
                                <div class="date-number">10</div>
                                <div class="date-text">十七</div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">11</div>
                                <div class="date-text">十八</div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">12</div>
                                <div class="date-text">十九</div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">13</div>
                                <div class="date-text">二十</div>
                            </div>
                            <div class="date-item today">
                                <div class="date-number">14</div>
                                <div class="date-text">今日</div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">15</div>
                                <div class="date-text">廿二</div>
                            </div>
                            <div class="date-item">
                                <div class="date-number">16</div>
                                <div class="date-text">廿三</div>
                            </div>
                        </div>
                        
                        <div class="calendar-expand">
                            <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>

                    <!-- 农事活动列表 -->
                    <div class="activities-section">
                        <h3>农事活动</h3>
                        
                        <!-- 活动卡片1 -->
                        <div class="activity-card">
                            <div class="activity-header">
                                <div class="activity-tag spraying">打药</div>
                                <div class="activity-title">打药</div>
                                <div class="activity-menu">
                                    <i class="fas fa-ellipsis-v"></i>
                                </div>
                            </div>
                            <div class="activity-details">
                                <div class="detail-item">
                                    <span class="detail-label">种植计划:</span>
                                    <span class="detail-value">打药</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">作物/品种:</span>
                                    <span class="detail-value">水仙花(1号)</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">基地/地块:</span>
                                    <span class="detail-value">大厅水培植物|一号分区|一号基地 (水培区|一号地块)</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">农事时间:</span>
                                    <span class="detail-value">2025-08-12~2025-08-12</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">负责人:</span>
                                    <span class="detail-value">王成龙</span>
                                </div>
                            </div>
                            <div class="activity-status completed">
                                <div class="status-stamp">已完成</div>
                            </div>
                        </div>

                        <!-- 活动卡片2 -->
                        <div class="activity-card" onclick="loadPage('farmActivityDetail')">
                            <div class="activity-header">
                                <div class="activity-tag spraying">打药</div>
                                <div class="activity-title">打药测试1</div>
                                <div class="activity-menu">
                                    <i class="fas fa-ellipsis-v"></i>
                                </div>
                            </div>
                            <div class="activity-details">
                                <div class="detail-item">
                                    <span class="detail-label">种植计划:</span>
                                    <span class="detail-value">打药</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">作物/品种:</span>
                                    <span class="detail-value">水仙花(1号)</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">基地/地块:</span>
                                    <span class="detail-value">大厅水培植物|一号分区|一号基地 (水培区|一号地块)</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">农事时间:</span>
                                    <span class="detail-value">2025-08-13~2025-08-13</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">负责人:</span>
                                    <span class="detail-value">王成龙</span>
                                </div>
                                <div class="detail-item">
                                    <div class="after-photo-entry">
                                        <i class="fas fa-camera"></i>
                                        <span>服务后拍照</span>
                                    </div>
                                </div>
                            </div>
                            <div class="activity-status completed">
                                <div class="status-stamp">已完成</div>
                            </div>
                        </div>

                        <!-- 活动卡片3 -->
                        <div class="activity-card">
                            <div class="activity-header">
                                <div class="activity-tag weeding">除草</div>
                                <div class="activity-title">除草</div>
                                <div class="activity-menu">
                                    <i class="fas fa-ellipsis-v"></i>
                                </div>
                            </div>
                            <div class="activity-details">
                                <div class="detail-item">
                                    <span class="detail-label">种植计划:</span>
                                    <span class="detail-value">打药</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">作物/品种:</span>
                                    <span class="detail-value">水仙花(1号)</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">基地/地块:</span>
                                    <span class="detail-value">大厅水培植物|一号分区|一号基地 (水培区|一号地块)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 浮动添加按钮 -->
                <div class="float-action-btn">
                    <i class="fas fa-plus"></i>
                </div>
            </div>
        `
    },

    farmActivityDetail: {
        title: '农事活动详情',
        subtitle: '打药测试1',
        content: `
            <div class="mobile-page farmActivityDetail-page">
                <div class="mobile-header">
                    <button class="back-btn" onclick="goBack()"><i class="fas fa-arrow-left"></i></button>
                    <h1>农事活动详情</h1>
                </div>
                <div class="mobile-content">
                    <!-- 活动摘要卡片（截图样式） -->
                    <div class="activity-summary">
                        <div class="summary-top">
                            <span class="activity-tag spraying">打药</span>
                            <span style="color:#666;">2025-08-13~2025-08-13</span>
                        </div>
                        <div class="summary-title">打药测试1</div>
                        <div class="summary-list">
                            <div class="detail-item"><span class="detail-label">基地/地块：</span><span class="detail-value">大厅水培植物 | 一号分区 | 一号基地(水培区 | 一号地块)</span></div>
                            <div class="detail-item"><span class="detail-label">种植计划：</span><span class="detail-value">打药</span></div>
                            <div class="detail-item"><span class="detail-label">负责人：</span><span class="detail-value">王成龙</span></div>
                            <div class="detail-item"><span class="detail-label">备注：</span><span class="detail-value"></span></div>
                        </div>
                    </div>
                    <!-- 农事照片 -->
                    <div class="detail-section">
                        <div class="section-header">
                            <i class="fas fa-mountain"></i>
                            <h3>农事照片</h3>
                        </div>
                        <div class="photo-upload">
                            <div class="photo-item">
                                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNEZBRjUwIi8+CjxwYXRoIGQ9Ik0yMCAyMEg0MFY0MEgyMFYyMFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=" alt="农事照片">
                                <div class="photo-remove">
                                    <i class="fas fa-times"></i>
                                </div>
                            </div>
                            <div class="photo-add">
                                <i class="fas fa-plus"></i>
                            </div>
                        </div>
                    </div>

                    <!-- 上传农事视频 -->
                    <div class="detail-section">
                        <div class="section-header">
                            <i class="fas fa-play"></i>
                            <h3>上传农事视频</h3>
                        </div>
                        <div class="video-upload">
                            <div class="video-item">
                                <div class="video-thumbnail">
                                    <i class="fas fa-play"></i>
                                    <span class="video-duration">00:02</span>
                                </div>
                                <div class="video-remove">
                                    <i class="fas fa-times"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 投入品使用成效监管 -->
                    <div class="detail-section">
                        <div class="section-header">
                            <i class="fas fa-chart-line"></i>
                            <h3>投入品使用成效监管: 人工拍照</h3>
                        </div>
                        <div class="monitoring-items">
                            <div class="monitoring-item">
                                <div class="monitoring-content">
                                    <span>现场工作人员已完成农事活动前的拍照任务</span>
                                    <button class="btn btn-small">查看</button>
                                </div>
                            </div>
                            <div class="monitoring-item">
                                <div class="monitoring-content">
                                    <span>现场工作人员<span class="highlight">超时未完成</span>农事活动后的拍照任务</span>
                                    <button class="btn btn-small">查看</button>
                                </div>
                            </div>
                            <div class="monitoring-item ai-service-item" onclick="loadPage('aiServiceEffect')">
                                <div class="monitoring-content">
                                    <div class="ai-service-content">
                                        <i class="fas fa-brain ai-service-icon"></i>
                                        <span>经AI技术对比分析,整体效果提升: <span class="effect-highlight">90%</span></span>
                                        <div class="ai-service-entry">
                                            <span class="ai-entry-text">查看AI服务成效</span>
                                            <i class="fas fa-arrow-right"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 农事活动描述 -->
                    <div class="detail-section">
                        <div class="section-header">
                            <h3>农事活动描述</h3>
                        </div>
                        <div class="activity-description">
                            <span>测试1</span>
                        </div>
                    </div>
                </div>
                <div class="mobile-footer">
                    <button class="btn" style="width:100%;">保存</button>
                </div>
            </div>
        `
    }
};
let currentPage = 'home';

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 加载首页
    loadPage('home');
    
    // 绑定导航事件
    bindNavigationEvents();
    
    // 绑定侧边栏切换事件
    bindSidebarToggle();
    
    // 初始化语音识别
    initSpeechRecognition();
});

// 绑定导航事件
function bindNavigationEvents() {
    // 主菜单项点击事件
    document.querySelectorAll('.nav-item.main-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            
            // 如果有子菜单，切换展开状态
            const subMenu = this.nextElementSibling;
            if (subMenu && subMenu.classList.contains('sub-menu')) {
                this.classList.toggle('expanded');
                subMenu.classList.toggle('expanded');
            } else {
                // 没有子菜单，直接加载页面
                if (page) {
                    // 左侧主菜单点击 AI 时跳转到新AI中心默认页
                    if (page === 'ai') {
                        loadPage('aiChatCenter');
                    } else {
                        loadPage(page);
                    }
                }
            }
        });
    });
    
    // 子菜单项点击事件
    document.querySelectorAll('.nav-item.sub-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            loadPage(page);
        });
    });
    
    // 底部导航点击事件
    document.addEventListener('click', function(e) {
        if (e.target.closest('.tab-item')) {
            const tabItem = e.target.closest('.tab-item');
            const page = tabItem.getAttribute('data-page');
            
            if (page) {
                // 更新活跃状态
                document.querySelectorAll('.tab-item').forEach(item => {
                    item.classList.remove('active');
                });
                tabItem.classList.add('active');
                
                // 加载页面
                if (page === 'mall') {
                    loadPage('mall');
                } else if (page === 'ai') {
                    loadPage('aiChatCenter');
                } else if (page === 'workbench') {
                    loadPage('workbench');
                } else {
                    loadPage(page);
                }
            }
        }
    });
}

// 绑定侧边栏切换事件
function bindSidebarToggle() {
    const toggleBtn = document.getElementById('toggleBtn');
    const sidebar = document.getElementById('sidebar');
    
    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        
        // 更新按钮图标
        const icon = this.querySelector('i');
        if (sidebar.classList.contains('collapsed')) {
            icon.className = 'fas fa-chevron-right';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
}

// 内联AI诊断功能初始化
function setupInlineAIDiagnosis() {
    console.log('Setting up inline AI diagnosis...');
    
    const uploadTrigger = document.getElementById('embeddedUploadTrigger');
    const imageInput = document.getElementById('embeddedImageInput');
    const textarea = document.getElementById('inlineQuestionTextarea');
    const diagnosisBtn = document.getElementById('btnStartDiagnosis');
    
    if (!uploadTrigger || !imageInput || !textarea || !diagnosisBtn) {
        console.error('Inline AI diagnosis elements not found');
        return;
    }
    
    console.log('Inline elements found, setting up events...');
    
    // 图片上传功能
    uploadTrigger.onclick = function() {
        console.log('Embedded upload trigger clicked');
        imageInput.click();
    };
    
    imageInput.onchange = function(e) {
        console.log('Inline files selected:', e.target.files.length);
        const files = e.target.files;
        if (files.length > 0) {
            handleInlineImageFiles(files);
        }
    };
    
    // 文字输入功能
    textarea.oninput = function() {
        updateSendButton();
    };
    
    // 初始化发送按钮状态
    updateSendButton();
}

// 处理内联图片文件
function handleInlineImageFiles(files) {
    console.log('Handling inline image files:', files.length);
    
    const imagePreview = document.getElementById('embeddedImagePreview');
    
    if (files.length === 0) return;
    
    // 清空之前的图片
    if (imagePreview) imagePreview.innerHTML = '';
    
    // 处理每个文件
    Array.from(files).forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageItem = createEmbeddedImagePreview(e.target.result, file.name, index);
                if (imagePreview) imagePreview.appendChild(imageItem);
            };
            reader.readAsDataURL(file);
        }
    });
    
    updateSendButton();
}

// 创建内嵌图片预览
function createEmbeddedImagePreview(src, name, index) {
    const imageItem = document.createElement('div');
    imageItem.className = 'embedded-image-item';
    imageItem.innerHTML = `
        <img src="${src}" alt="${name}">
        <button class="embedded-remove-btn" onclick="removeEmbeddedImage(${index})">
            <i class="fas fa-times"></i>
        </button>
    `;
    return imageItem;
}

// 移除内嵌图片
function removeEmbeddedImage(index) {
    const imagePreview = document.getElementById('embeddedImagePreview');
    const imageItems = imagePreview.querySelectorAll('.embedded-image-item');
    
    if (imageItems[index]) {
        imageItems[index].remove();
    }
    
    updateSendButton();
}

// 更新发送按钮状态
function updateSendButton() {
    const textarea = document.getElementById('inlineQuestionTextarea');
    const imagePreview = document.getElementById('embeddedImagePreview');
    const diagnosisBtn = document.getElementById('btnStartDiagnosis');
    
    if (!textarea || !diagnosisBtn) return;
    
    const hasText = textarea.value.trim().length > 0;
    const hasImages = imagePreview && imagePreview.children.length > 0;
    
    // 有文字或图片就可以发送
    if (hasText || hasImages) {
        diagnosisBtn.classList.add('active');
        diagnosisBtn.disabled = false;
    } else {
        diagnosisBtn.classList.remove('active');
        diagnosisBtn.disabled = true;
    }
}

// 开始内联诊断
function startInlineDiagnosis() {
    const textarea = document.getElementById('inlineQuestionTextarea');
    const imagePreview = document.getElementById('embeddedImagePreview');
    
    const questionText = textarea ? textarea.value.trim() : '';
    const hasImages = imagePreview && imagePreview.children.length > 0;
    
    if (!questionText && !hasImages) {
        showInlineNotification('请输入问题或上传图片', 'warning');
        return;
    }
    
    console.log('Starting inline diagnosis...');
    console.log('Question:', questionText);
    console.log('Has images:', hasImages);
    
    // 收集用户输入数据
    const userInput = {
        text: questionText,
        images: hasImages ? Array.from(uploadedImages.querySelectorAll('img')).map(img => img.src) : []
    };
    
    // 将用户输入数据存储到全局变量
    window.currentDiagnosisData = userInput;
    
    // 跳转到AI诊断页面并直接开始诊断
    loadPage('aiDiagnosis');
}

// 显示内联通知
function showInlineNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `inline-notification inline-notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // 插入到AI卡片中
    const aiCard = document.querySelector('.ai-diagnosis-card');
    if (aiCard) {
        aiCard.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// 显示用户输入内容摘要
function displayUserInputSummary(userInput) {
    const summaryImages = document.getElementById('summaryImages');
    const summaryText = document.getElementById('summaryText');
    
    if (!summaryImages || !summaryText) {
        console.error('Summary elements not found');
        return;
    }
    
    console.log('Displaying user input summary:', userInput);
    
    // 显示图片
    if (userInput.images && userInput.images.length > 0) {
        summaryImages.innerHTML = userInput.images.map(imageSrc => `
            <div class="summary-image-item">
                <img src="${imageSrc}" alt="用户上传的图片" />
            </div>
        `).join('');
        summaryImages.style.display = 'flex';
    } else {
        summaryImages.style.display = 'none';
    }
    
    // 显示文字描述
    if (userInput.text && userInput.text.trim()) {
        summaryText.innerHTML = `
            <div class="summary-text-content">
                <div class="summary-text-label">问题描述：</div>
                <div class="summary-text-value">${userInput.text}</div>
            </div>
        `;
        summaryText.style.display = 'block';
    } else {
        summaryText.style.display = 'none';
    }
}

// AI诊断相关函数
function showAIDiagnosis() {
    console.log('Loading AI new chat page...');
    loadPage('aiNewChat');
}

// 提交AI诊断（原型）
window.submitNewConversation = function() {
    const text = document.getElementById('inlineQuestionTextarea')?.value || '';
    const conv = createConversation({ title: 'AI诊断', inputText: text, images: [] });
    // 简单模拟：立即跳转诊断详情并开始进度
    loadPage('aiDiagnosis');
    setTimeout(() => {
        // 绑定会话并开始模拟
        setConversationStatus(conv.id, 'running');
        simulateDiagnosisFor(conv.id);
    }, 50);
};

function simulateDiagnosisFor(id){
    // 让现有进度条动完后设置done
    setTimeout(()=> setConversationStatus(id, 'done'), 5500);
}

// 历史对话渲染与筛选（原型）
window.filterHistory = function(keyword='') {
    const wrap = document.getElementById('historyList');
    if (!wrap) return;
    const items = conversationStore.list.filter(c =>
        (c.title||'').includes(keyword) || (c.inputText||'').includes(keyword)
    );
    wrap.innerHTML = items.map(c => `
        <div class="card chat-item" onclick="openConversation('${c.id}')">
            <div class="chat-title">${c.inputText?.slice(0, 12) || 'AI诊断'}</div>
            <div class="chat-sub">${c.createdAt} · ${c.status}</div>
        </div>
    `).join('') || '<div class="card" style="text-align:center;color:#999;">暂无历史会话</div>';
};

window.openConversation = function(id){
    conversationStore.currentId = id;
    loadPage('aiDiagnosis');
};

// 加载专家详情数据
function loadExpertDetail(expertId) {
    const expert = expertData[expertId];
    if (!expert) return;
    
    // 更新专家基本信息
    const nameEl = document.getElementById('expertName');
    if (nameEl) nameEl.textContent = expert.name;
    
    const specialtiesEl = document.getElementById('expertSpecialties');
    if (specialtiesEl) {
        specialtiesEl.innerHTML = expert.specialties.map(s => `<span class="tag">${s}</span>`).join('');
    }
    
    const backgroundEl = document.getElementById('expertBackground');
    if (backgroundEl) backgroundEl.textContent = expert.background;
    
    // 更新知识库服务
    const knowledgeEl = document.getElementById('knowledgeItems');
    if (knowledgeEl) {
        knowledgeEl.innerHTML = expert.knowledge.map(item => `
            <div class="knowledge-item">
                <div class="knowledge-title">${item.title}</div>
                <div class="knowledge-desc">${item.desc}</div>
                <div class="knowledge-price">${item.price}</div>
            </div>
        `).join('');
    }
    
    // 更新推荐产品
    const productsEl = document.getElementById('productItems');
    if (productsEl) {
        productsEl.innerHTML = expert.products.map(item => `
            <div class="product-item">
                <div class="product-name">${item.name}</div>
                <div class="product-desc">${item.desc}</div>
                <div class="product-tags">
                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="product-price">${item.price}</div>
                <button class="btn-buy">立即购买</button>
            </div>
        `).join('');
    }
}

// 设置图片上传功能
function setupImageUpload() {
    console.log('Setting up image upload...');
    
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    
    if (!uploadArea || !imageInput) {
        console.error('Upload elements not found');
        return;
    }
    
    console.log('Upload elements found, setting up events...');
    
    // 点击上传区域触发文件选择
    uploadArea.onclick = function() {
        console.log('Upload area clicked');
        imageInput.click();
    };
    
    // 文件选择处理
    imageInput.onchange = function(e) {
        console.log('Files selected:', e.target.files.length);
        const files = e.target.files;
        if (files.length > 0) {
            handleImageFiles(files);
        }
    };
    
    // 拖拽上传
    uploadArea.ondragover = function(e) {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    };
    
    uploadArea.ondragleave = function() {
        uploadArea.classList.remove('drag-over');
    };
    
    uploadArea.ondrop = function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        console.log('Files dropped:', files.length);
        if (files.length > 0) {
            handleImageFiles(files);
        }
    };
}

// 处理图片文件
function handleImageFiles(files) {
    console.log('Handling image files:', files.length);
    
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const uploadedImages = document.getElementById('uploadedImages');
    const questionInputCard = document.getElementById('questionInputCard');
    
    if (files.length === 0) {
        console.log('No files to process');
        return;
    }
    
    // 隐藏占位符，显示图片预览区域
    if (uploadPlaceholder) uploadPlaceholder.style.display = 'none';
    if (uploadedImages) uploadedImages.style.display = 'block';
    
    // 清空之前的图片
    uploadedImages.innerHTML = '';
    
    // 处理每个文件
    Array.from(files).forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageItem = createImagePreview(e.target.result, file.name, index);
                uploadedImages.appendChild(imageItem);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 显示问题输入区域
    if (questionInputCard) {
        questionInputCard.style.display = 'block';
        questionInputCard.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 检查是否可以开始诊断
    checkCanStartDiagnosis();
}

// 创建图片预览
function createImagePreview(src, name, index) {
    const imageItem = document.createElement('div');
    imageItem.className = 'image-preview-item';
    imageItem.innerHTML = `
        <div class="image-preview">
            <img src="${src}" alt="${name}">
            <div class="image-overlay">
                <div class="image-name">${name}</div>
                <button class="btn-remove-image" onclick="removeImage(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
    return imageItem;
}

// 移除图片
function removeImage(index) {
    const uploadedImages = document.getElementById('uploadedImages');
    const imageItems = uploadedImages.querySelectorAll('.image-preview-item');
    
    if (imageItems[index]) {
        imageItems[index].remove();
    }
    
    // 如果没有图片了，显示占位符
    if (uploadedImages.children.length === 0) {
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        const questionInputCard = document.getElementById('questionInputCard');
        const startDiagnosisCard = document.getElementById('startDiagnosisCard');
        
        if (uploadPlaceholder) uploadPlaceholder.style.display = 'block';
        uploadedImages.style.display = 'none';
        if (questionInputCard) questionInputCard.style.display = 'none';
        if (startDiagnosisCard) startDiagnosisCard.style.display = 'none';
    }
    
    checkCanStartDiagnosis();
}

// 设置文字输入功能
function setupTextInput() {
    console.log('Setting up text input...');
    
    const textarea = document.getElementById('questionTextarea');
    const charCount = document.getElementById('charCount');
    const voiceInputBtn = document.getElementById('voiceInputBtn');
    
    if (!textarea || !charCount) {
        console.error('Text input elements not found');
        return;
    }
    
    console.log('Text input elements found, setting up events...');
    
    // 字符计数
    textarea.oninput = function() {
        const length = textarea.value.length;
        charCount.textContent = length;
        
        if (length > 500) {
            textarea.value = textarea.value.substring(0, 500);
            charCount.textContent = 500;
        }
        
        checkCanStartDiagnosis();
    };
    
    // 语音输入（模拟功能）
    if (voiceInputBtn) {
        voiceInputBtn.onclick = function() {
            alert('语音输入功能开发中...');
        };
    }
}

// 检查是否可以开始诊断
function checkCanStartDiagnosis() {
    const uploadedImages = document.getElementById('uploadedImages');
    const startDiagnosisCard = document.getElementById('startDiagnosisCard');
    
    if (!uploadedImages || !startDiagnosisCard) return;
    
    const hasImages = uploadedImages.children.length > 0;
    
    if (hasImages) {
        startDiagnosisCard.style.display = 'block';
        startDiagnosisCard.scrollIntoView({ behavior: 'smooth' });
    } else {
        startDiagnosisCard.style.display = 'none';
    }
}

// 验证并开始诊断
function validateAndStartDiagnosis() {
    const uploadedImages = document.getElementById('uploadedImages');
    const textarea = document.getElementById('questionTextarea');
    
    // 验证是否有图片
    if (!uploadedImages || uploadedImages.children.length === 0) {
        showNotification('请先上传作物图片', 'error');
        return;
    }
    
    // 获取用户输入的问题描述
    const questionText = textarea ? textarea.value.trim() : '';
    
    // 隐藏输入区域，显示诊断状态
    const imageUploadCard = document.getElementById('imageUploadCard');
    const questionInputCard = document.getElementById('questionInputCard');
    const startDiagnosisCard = document.getElementById('startDiagnosisCard');
    const diagnosisStatusCard = document.getElementById('diagnosisStatusCard');
    const timelineCard = document.getElementById('timelineCard');
    
    if (imageUploadCard) imageUploadCard.style.display = 'none';
    if (questionInputCard) questionInputCard.style.display = 'none';
    if (startDiagnosisCard) startDiagnosisCard.style.display = 'none';
    if (diagnosisStatusCard) diagnosisStatusCard.style.display = 'block';
    if (timelineCard) timelineCard.style.display = 'block';
    
    // 开始AI诊断
    startAIDiagnosis();
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => notification.classList.add('show'), 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function startAIDiagnosis() {
    // 模拟AI诊断进度
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            completeAIDiagnosis();
        }
        
        // 更新进度条
        const progressBar = document.getElementById('diagnosisProgress');
        const progressText = document.getElementById('progressText');
        if (progressBar && progressText) {
            progressBar.style.width = progress + '%';
            progressText.textContent = `分析中 ${Math.round(progress)}%`;
        }
        
        // 更新时间线
        updateTimeline(progress);
    }, 200);
}

function updateTimeline(progress) {
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const step4 = document.getElementById('step-4');
    
    // 重置所有步骤
    [step1, step2, step3, step4].forEach(step => {
        if (step) {
            step.classList.remove('active', 'completed');
            const stepBox = step.querySelector('.step-box');
            const stepIcon = step.querySelector('.step-icon');
            const stepCheck = step.querySelector('.step-check');
            if (stepBox && stepIcon && stepCheck) {
                stepIcon.style.display = 'block';
                stepCheck.style.display = 'none';
            }
        }
    });
    
    if (progress >= 25 && step1) {
        step1.classList.add('completed');
        const stepBox = step1.querySelector('.step-box');
        const stepIcon = step1.querySelector('.step-icon');
        const stepCheck = step1.querySelector('.step-check');
        if (stepBox && stepIcon && stepCheck) {
            stepIcon.style.display = 'none';
            stepCheck.style.display = 'block';
        }
    }
    
    if (progress >= 50 && step2) {
        step2.classList.add('completed');
        const stepBox = step2.querySelector('.step-box');
        const stepIcon = step2.querySelector('.step-icon');
        const stepCheck = step2.querySelector('.step-check');
        if (stepBox && stepIcon && stepCheck) {
            stepIcon.style.display = 'none';
            stepCheck.style.display = 'block';
        }
    }
    
    if (progress >= 75 && step3) {
        step3.classList.add('completed');
        const stepBox = step3.querySelector('.step-box');
        const stepIcon = step3.querySelector('.step-icon');
        const stepCheck = step3.querySelector('.step-check');
        if (stepBox && stepIcon && stepCheck) {
            stepIcon.style.display = 'none';
            stepCheck.style.display = 'block';
        }
    }
    
    if (progress >= 100 && step4) {
        step4.classList.add('completed');
        const stepBox = step4.querySelector('.step-box');
        const stepIcon = step4.querySelector('.step-icon');
        const stepCheck = step4.querySelector('.step-check');
        if (stepBox && stepIcon && stepCheck) {
            stepIcon.style.display = 'none';
            stepCheck.style.display = 'block';
        }
    }
}

function completeAIDiagnosis() {
    // 显示诊断结果
    const diagnosisResult = document.getElementById('diagnosisResult');
    const expertSection = document.getElementById('expertSection');
    const productRecommendation = document.getElementById('productRecommendation');
    const diagnosisStatusCard = document.getElementById('diagnosisStatusCard');
    
    // 诊断完成后隐藏进度卡片，避免残留显示不全
    if (diagnosisStatusCard) {
        diagnosisStatusCard.style.display = 'none';
    }
    
    if (diagnosisResult) {
        diagnosisResult.style.display = 'block';
        diagnosisResult.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 延迟显示专家推荐与连线
    setTimeout(() => {
        if (expertSection) {
            expertSection.style.display = 'block';
            expertSection.scrollIntoView({ behavior: 'smooth' });
            // 初始化专家卡片滑动功能
            initExpertCarousel();
        }
    }, 1000);
    
    // 延迟显示商品推荐
    setTimeout(() => {
        if (productRecommendation) {
            productRecommendation.style.display = 'block';
            productRecommendation.scrollIntoView({ behavior: 'smooth' });
        }
    }, 2000);
}

function showExpertRecommendation() {
    const expertCard = document.getElementById('expertSection');
    if (expertCard) {
        expertCard.style.display = 'block';
        expertCard.scrollIntoView({ behavior: 'smooth' });
        // 初始化专家卡片滑动功能
        initExpertCarousel();
    }
}

// 初始化专家卡片滑动功能
function initExpertCarousel() {
    const container = document.getElementById('expertsContainer');
    const indicators = document.querySelectorAll('.indicator');
    const cards = document.querySelectorAll('.expert-card');
    
    if (!container || !indicators.length || !cards.length) return;
    
    let currentIndex = 0;
    
    // 点击指示器切换卡片
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    // 更新轮播状态
    function updateCarousel() {
        // 移动容器
        container.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // 更新指示器
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
        
        // 更新卡片状态
        cards.forEach((card, index) => {
            card.classList.toggle('active', index === currentIndex);
        });
    }
    
    // 自动轮播
    setInterval(() => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    }, 5000);
}

function showOrderManagement() {
    // 显示订单管理页面
    alert('跳转到闭环跟进页面');
}

// 专家数据
const expertData = {
    wangjianguo: {
        name: '王建国',
        specialties: ['玉米病害', '小麦锈病'],
        background: '从事农业植保工作15年，专注于玉米和小麦病害研究，发表相关论文20余篇，具有丰富的田间实践经验。',
        knowledge: [
            { title: '玉米病害诊断手册', desc: '包含50+种玉米常见病害的识别与防治方法', price: '¥29.9' },
            { title: '小麦锈病防治方案', desc: '专业的小麦锈病预防与治疗指导', price: '¥19.9' }
        ],
        products: [
            { name: '杀菌剂A', desc: '广谱杀菌剂，对叶斑病效果显著', tags: ['专家推荐', 'AI匹配'], price: '¥28.00' },
            { name: '防治套餐', desc: '综合防治方案，包含多种药剂', tags: ['专家推荐'], price: '¥128.00' }
        ]
    },
    limin: {
        name: '李敏',
        specialties: ['水稻虫害', '植保方案'],
        background: '水稻病虫害防治专家，拥有12年水稻种植和病虫害防治经验，擅长制定综合植保方案。',
        knowledge: [
            { title: '水稻虫害识别指南', desc: '详细的水稻常见虫害识别与防治方法', price: '¥24.9' },
            { title: '植保方案制定手册', desc: '科学制定植保方案的专业指导', price: '¥34.9' }
        ],
        products: [
            { name: '虫害套装', desc: '针对水稻虫害的综合防治套装', tags: ['专家推荐'], price: '¥88.00' }
        ]
    },
    zhangsan: {
        name: '张三',
        specialties: ['果树病害', '土壤改良'],
        background: '果树栽培与土壤改良专家，专注于果树病害防治和土壤健康管理，拥有18年实践经验。',
        knowledge: [
            { title: '果树病害防治大全', desc: '涵盖各类果树常见病害的防治方法', price: '¥39.9' },
            { title: '土壤改良技术指南', desc: '科学改良土壤的专业技术指导', price: '¥29.9' }
        ],
        products: [
            { name: '有机肥料', desc: '高品质有机肥料，改善土壤结构', tags: ['专家推荐'], price: '¥45.00' },
            { name: '土壤调理剂', desc: '专业土壤调理剂，平衡土壤酸碱度', tags: ['专家推荐'], price: '¥35.00' }
        ]
    },
    lisi: {
        name: '李四',
        specialties: ['蔬菜种植', '温室管理'],
        background: '蔬菜种植与温室管理专家，精通各类蔬菜的种植技术和温室环境控制，拥有14年实践经验。',
        knowledge: [
            { title: '蔬菜种植技术手册', desc: '各类蔬菜的科学种植技术指导', price: '¥32.9' },
            { title: '温室管理实用指南', desc: '温室环境控制与管理的最佳实践', price: '¥27.9' }
        ],
        products: [
            { name: '温室设备', desc: '专业温室设备，提升种植效率', tags: ['专家推荐'], price: '¥299.00' },
            { name: '种植技术', desc: '科学种植技术指导服务', tags: ['专家推荐'], price: '¥199.00' }
        ]
    },
    wangwu: {
        name: '王五',
        specialties: ['植保技术', '农药使用'],
        background: '植保技术与农药使用专家，专注于安全用药和植保技术推广，拥有16年植保工作经验。',
        knowledge: [
            { title: '安全用药指南', desc: '农药安全使用的专业指导', price: '¥22.9' },
            { title: '植保技术大全', desc: '现代植保技术的综合应用指南', price: '¥36.9' }
        ],
        products: [
            { name: '安全用药', desc: '安全用药指导服务', tags: ['专家推荐'], price: '¥158.00' },
            { name: '植保方案', desc: '定制化植保方案制定', tags: ['专家推荐'], price: '¥268.00' }
        ]
    }
};

// 加载页面
function loadPage(pageName, param) {
    const phoneContent = document.getElementById('phoneContent');
    const pageInfo = pageData[pageName];
    
    if (pageInfo) {
        if (!window.__pageStack) window.__pageStack = [];
        if (window.currentPage) {
            window.__pageStack.push(window.currentPage);
        }
        // 更新页面内容
        phoneContent.innerHTML = pageInfo.content;
        
        // 更新当前页面
        currentPage = pageName;
        
        // 更新导航状态
        updateNavigationState(pageName);

        // 确保底部导航存在并高亮当前页
        ensureTabbar(pageName);
        
        // 滚动到顶部
        phoneContent.scrollTop = 0;
        
        // 如果是首页，初始化AI诊断功能
        if (pageName === 'home') {
            setTimeout(() => {
                console.log('Initializing inline AI diagnosis features...');
                setupInlineAIDiagnosis();
            }, 100);
        }
        
        // 如果是智能体广场页面，自动绑定卡片点击事件
        if (pageName === 'agentMarket') {
            setTimeout(() => {
                initAgentCardClicks();
            }, 100);
        }
        
        // 如果是专家详情页面，加载专家数据
        if (pageName === 'expertDetail' && param && expertData[param]) {
            setTimeout(() => {
                loadExpertDetail(param);
            }, 100);
        }
        
        // 如果是AI诊断页面，显示用户输入并直接开始诊断
        if (pageName === 'aiDiagnosis') {
            setTimeout(() => {
                console.log('Auto-starting AI diagnosis...');
                if (window.currentDiagnosisData) {
                    displayUserInputSummary(window.currentDiagnosisData);
                    startAIDiagnosis();
                } else {
                    console.log('No legacy data; bind conversation if any.');
                    // 渲染历史会话（若从历史进入）
                    const inputCard = document.getElementById('questionInputCard');
                    // 若没有当前会话，显示AI诊断输入卡片
                    if (!conversationStore.currentId && inputCard) {
                        inputCard.style.display = 'block';
                    }
                    if (conversationStore.currentId) {
                        const c = getConversation(conversationStore.currentId);
                        if (c) {
                            // 隐藏输入卡片，显示已提交内容
                            if (inputCard) inputCard.style.display = 'none';
                            displayUserInputSummary({ questionText: c.inputText, images: [] });
                            if (c.status === 'queued' || c.status === 'running') {
                                startAIDiagnosis();
                            }
                        }
                    }
                }
            }, 100);
        }
    }
}

// 确保底部导航存在并设置选中态
function ensureTabbar(pageName) {
    try {
        const pageEl = document.querySelector('.mobile-page');
        if (!pageEl) return;

        // AI相关页面(新三段式：智能体广场/AI对话/我的订阅 以及 旧AI页)不插入全局5项tabbar
        const isAIFourMenuPage = ['agentMarket','aiChatCenter','mySubscriptions','aiNewChat','expertRecommend','historyDialog','aiDiagnosis','pestDetect'].includes(pageName);
        // 若页面内不存在通用 tabbar，则插入（非AI四菜单页）
        if (!isAIFourMenuPage && !pageEl.querySelector('.mobile-footer.tabbar')) {
            const footerHtml = `
                <div class="mobile-footer tabbar">
                    <div class="tab-item" data-page="home"><i class="fas fa-home"></i><span>首页</span></div>
                    <div class="tab-item" data-page="mall"><i class="fas fa-store"></i><span>商城</span></div>
                    <div class="tab-item" data-page="ai"><i class="fas fa-robot"></i><span>AI</span></div>
                    <div class="tab-item" data-page="workbench"><i class="fas fa-briefcase"></i><span>工作台</span></div>
                    <div class="tab-item" data-page="profile"><i class="fas fa-user"></i><span>我的</span></div>
                </div>
            `;
            pageEl.insertAdjacentHTML('beforeend', footerHtml);
        }

        // 将业务页面名映射为 tabbar 的 data-page 值
        const tabKey = (function(name) {
            if (name === 'fieldWorkstation') return 'workbench';
            if (name === 'workbench') return 'workbench';
            // 新AI三段式页面在全局tabbar上归为 AI
            if (['agentMarket','aiChatCenter','mySubscriptions','aiNewChat','expertRecommend','historyDialog','aiDiagnosis'].includes(name)) return 'ai';
            return name;
        })(pageName);

        // 重置并设置选中态
        document.querySelectorAll('.mobile-footer.tabbar .tab-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-page') === tabKey);
        });
    } catch (e) {
        console.error('ensureTabbar error:', e);
    }
}

// 返回上一页
function goBack() {
    if (window.__pageStack && window.__pageStack.length > 0) {
        const prev = window.__pageStack.pop();
        if (prev) loadPage(prev);
    } else {
        loadPage('home');
    }
}

// 更新导航状态
function updateNavigationState(pageName) {
    // 清除所有活动状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 设置当前页面的活动状态
    const activeItem = document.querySelector(`[data-page="${pageName}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
        
        // 如果是子菜单项，展开父菜单
        if (activeItem.classList.contains('sub-item')) {
            const parentSection = activeItem.closest('.nav-section');
            const mainItem = parentSection.querySelector('.main-item');
            const subMenu = parentSection.querySelector('.sub-menu');
            
            if (mainItem && subMenu) {
                mainItem.classList.add('expanded');
                subMenu.classList.add('expanded');
            }
        }
    }
}

// 显示消息页面
function showMessages() {
    showNotification('消息功能开发中...', 'info');
}

// 显示即将推出功能
function showComingSoon(featureName) {
    if (featureName === '与现有功能保持一致') {
        showNotification('与现有功能保持一致', 'info');
    } else {
        showNotification(`${featureName}功能即将推出，敬请期待！`, 'info');
    }
}

// ===== 智能体卡片点击处理 =====
function initAgentCardClicks() {
    // 为所有智能体卡片绑定点击事件
    const cards = document.querySelectorAll('.agent-card-detailed');
    cards.forEach(card => {
        const agentId = card.getAttribute('data-agent-id');
        const priceType = card.getAttribute('data-price');
        
        if (agentId && priceType) {
            card.onclick = function(event) {
                handleAgentCardClick(event, agentId, priceType);
            };
        }
    });
}

function handleAgentCardClick(event, agentId, priceType) {
    // 如果点击的是订阅按钮，阻止卡片点击事件
    if (event.target.closest('.subscribe-btn')) {
        event.stopPropagation();
        return;
    }
    
    const card = document.querySelector(`[data-agent-id="${agentId}"]`);
    const agentName = card.querySelector('.agent-name').textContent;
    
    if (priceType === 'free') {
        // 免费智能体，直接跳转到AI对话页面
        loadAgentChatPage(agentId, agentName);
    } else {
        // 付费智能体，检查是否已订阅
        const subscribeBtn = card.querySelector('.subscribe-btn');
        if (subscribeBtn && subscribeBtn.classList.contains('subscribed')) {
            // 已订阅，跳转到AI对话页面
            loadAgentChatPage(agentId, agentName);
        } else {
            // 未订阅，提示需要付费订阅
            const agentPrice = card.querySelector('.agent-price').textContent;
            showPaymentRequired(agentId, agentName, agentPrice);
        }
    }
}

function showPaymentRequired(agentId, agentName, agentPrice) {
    // 显示付费提示对话框
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'payment-modal';
    confirmDialog.innerHTML = `
        <div class="modal-overlay" onclick="closePaymentModal()"></div>
        <div class="modal-content payment-modal-content">
            <div class="modal-header">
                <h3>需要订阅</h3>
                <button class="close-btn" onclick="closePaymentModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="payment-info">
                    <div class="agent-info-preview">
                        <div class="agent-name-large">${agentName}</div>
                        <div class="subscription-type">需要月度会员</div>
                    </div>
                    <div class="price-info">
                        <div class="price-label">订阅后即可使用</div>
                        <div class="price-amount">${agentPrice}</div>
                        <div class="price-note">按月自动续费，可随时取消</div>
                    </div>
                    <div class="payment-benefits">
                        <div class="benefit-title">会员权益：</div>
                        <div class="benefit-item"><i class="fas fa-check-circle"></i> 无限次使用智能体服务</div>
                        <div class="benefit-item"><i class="fas fa-check-circle"></i> 优先获得功能更新</div>
                        <div class="benefit-item"><i class="fas fa-check-circle"></i> 专属客服支持</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closePaymentModal()">取消</button>
                <button class="btn-primary" onclick="confirmPayment('${agentId}', '${agentName}', '${agentPrice}')">
                    <i class="fas fa-lock"></i> 立即订阅
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmDialog);
}

function loadAgentChatPage(agentId, agentName) {
    // 创建AI对话页面
    if (!pageData.agentChat) {
        pageData.agentChat = {
            title: 'AI对话',
            subtitle: '智能体对话',
            content: ''
        };
    }
    
    // 生成对话页面内容
    pageData.agentChat.title = agentName;
    pageData.agentChat.content = `
        <div class="mobile-page agent-chat-page">
            <div class="mobile-header chat-header">
                <button class="back-btn" onclick="goBack()">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="chat-title">
                    <h1>${agentName}</h1>
                    <div class="chat-subtitle">AI智能助手</div>
                </div>
                <button class="header-menu-btn" onclick="showChatMenu()">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </div>
            <div class="chat-messages-container" id="chatMessagesContainer">
                <div class="chat-messages" id="chatMessages">
                    <div class="chat-welcome">
                        <div class="welcome-icon">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="welcome-text">您好！我是${agentName}，有什么可以帮您的吗？</div>
                        <div class="quick-questions">
                            <div class="quick-question" onclick="sendQuickQuestion('如何使用这个智能体？')">
                                如何使用这个智能体？
                            </div>
                            <div class="quick-question" onclick="sendQuickQuestion('你能帮我做什么？')">
                                你能帮我做什么？
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="chat-input-area">
                <div class="chat-input-container">
                    <button class="voice-btn" onclick="startVoiceInput()">
                        <i class="fas fa-microphone"></i>
                    </button>
                    <input type="text" 
                           class="chat-input" 
                           id="chatInput" 
                           placeholder="有什么需要问我的吗~" 
                           onkeypress="if(event.key==='Enter') sendChatMessage()">
                    <button class="add-btn" onclick="showAddMenu()">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="send-btn" onclick="sendChatMessage()">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    loadPage('agentChat');
    
    // 存储当前智能体信息
    window.currentAgentId = agentId;
    window.currentAgentName = agentName;
}

// ===== AI对话相关功能 =====
function sendQuickQuestion(question) {
    document.getElementById('chatInput').value = question;
    sendChatMessage();
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) {
        return;
    }
    
    // 添加用户消息
    addChatMessage('user', message);
    input.value = '';
    
    // 模拟AI回复
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addChatMessage('ai', aiResponse);
    }, 800);
}

function addChatMessage(type, content) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}-message`;
    
    if (type === 'user') {
        messageDiv.innerHTML = `
            <div class="message-content user-content">
                <div class="message-bubble">${content}</div>
            </div>
            <div class="message-avatar user-avatar">
                <i class="fas fa-user"></i>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-avatar ai-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content ai-content">
                <div class="message-bubble">${content}</div>
                <div class="message-actions">
                    <button class="action-btn" onclick="copyMessage(this)" title="复制">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="action-btn" onclick="likeMessage(this)" title="赞">
                        <i class="far fa-thumbs-up"></i>
                    </button>
                    <button class="action-btn" onclick="dislikeMessage(this)" title="踩">
                        <i class="far fa-thumbs-down"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    
    // 滚动到底部
    const container = document.getElementById('chatMessagesContainer');
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 100);
}

function generateAIResponse(userMessage) {
    // 简单的AI回复生成逻辑
    const responses = [
        `关于"${userMessage}"这个问题，我可以为您提供专业的建议。`,
        `我理解您的需求，让我为您分析一下。`,
        `这是一个很好的问题！根据我的知识库，`,
        `针对您提到的情况，我建议您可以考虑以下几点：`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           `\n\n具体来说，${window.currentAgentName || '我'}可以帮助您分析和解决这个问题。如果您需要更详细的解答，请继续提问。`;
}

function copyMessage(btn) {
    const bubble = btn.closest('.message-content').querySelector('.message-bubble');
    navigator.clipboard.writeText(bubble.textContent);
    showNotification('已复制到剪贴板', 'success');
}

function likeMessage(btn) {
    btn.innerHTML = '<i class="fas fa-thumbs-up"></i>';
    btn.style.color = '#21c08b';
    showNotification('感谢您的反馈', 'success');
}

function dislikeMessage(btn) {
    btn.innerHTML = '<i class="fas fa-thumbs-down"></i>';
    btn.style.color = '#ff6b6b';
    showNotification('我们会继续改进', 'info');
}

function showChatMenu() {
    showNotification('聊天菜单功能开发中...', 'info');
}

function showAddMenu() {
    showNotification('附件功能开发中...', 'info');
}

// ===== 智能体订阅功能 =====
function subscribeAgent(agentId, priceType) {
    const card = document.querySelector(`[data-agent-id="${agentId}"]`);
    const subscribeBtn = card.querySelector('.subscribe-btn');
    const agentName = card.querySelector('.agent-name').textContent;
    
    // 检查是否已经订阅
    if (subscribeBtn.classList.contains('subscribed')) {
        showNotification('您已订阅该智能体', 'info');
        return;
    }
    
    if (priceType === 'free') {
        // 免费智能体直接订阅
        subscribeBtn.textContent = '已订阅';
        subscribeBtn.classList.add('subscribed');
        showNotification(`订阅成功！您已成功订阅 ${agentName}`, 'success');
        
        // 更新我的订阅页面（这里可以添加实际的数据持久化逻辑）
        updateMySubscriptions(agentId, agentName, priceType);
    } else {
        // 付费智能体，显示月度会员付费提示
        const agentPrice = card.querySelector('.agent-price').textContent;
        
        // 创建付费确认对话框
        const confirmDialog = document.createElement('div');
        confirmDialog.className = 'payment-modal';
        confirmDialog.innerHTML = `
            <div class="modal-overlay" onclick="closePaymentModal()"></div>
            <div class="modal-content payment-modal-content">
                <div class="modal-header">
                    <h3>订阅确认</h3>
                    <button class="close-btn" onclick="closePaymentModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="payment-info">
                        <div class="agent-info-preview">
                            <div class="agent-name-large">${agentName}</div>
                            <div class="subscription-type">月度会员</div>
                        </div>
                        <div class="price-info">
                            <div class="price-label">订阅费用</div>
                            <div class="price-amount">${agentPrice}</div>
                            <div class="price-note">按月自动续费，可随时取消</div>
                        </div>
                        <div class="payment-benefits">
                            <div class="benefit-title">会员权益：</div>
                            <div class="benefit-item"><i class="fas fa-check-circle"></i> 无限次使用智能体服务</div>
                            <div class="benefit-item"><i class="fas fa-check-circle"></i> 优先获得功能更新</div>
                            <div class="benefit-item"><i class="fas fa-check-circle"></i> 专属客服支持</div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="closePaymentModal()">取消</button>
                    <button class="btn-primary" onclick="confirmPayment('${agentId}', '${agentName}', '${agentPrice}')">
                        <i class="fas fa-lock"></i> 确认付费订阅
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(confirmDialog);
    }
}

function closePaymentModal() {
    const modal = document.querySelector('.payment-modal');
    if (modal) {
        modal.remove();
    }
}

function confirmPayment(agentId, agentName, agentPrice) {
    // 模拟支付流程
    showNotification('正在处理支付...', 'info');
    
    setTimeout(() => {
        const card = document.querySelector(`[data-agent-id="${agentId}"]`);
        const subscribeBtn = card.querySelector('.subscribe-btn');
        
        subscribeBtn.textContent = '已订阅';
        subscribeBtn.classList.add('subscribed');
        
        closePaymentModal();
        showNotification(`订阅成功！您已成功订阅 ${agentName} 月度会员`, 'success');
        
        // 更新我的订阅页面
        updateMySubscriptions(agentId, agentName, 'paid', agentPrice);
    }, 1500);
}

function updateMySubscriptions(agentId, agentName, priceType, agentPrice = '免费') {
    // 这里可以添加实际的数据持久化逻辑
    // 例如：将订阅信息保存到 localStorage 或发送到后端服务器
    
    // 简单的localStorage实现
    let subscriptions = JSON.parse(localStorage.getItem('agentSubscriptions') || '[]');
    
    // 检查是否已存在
    if (!subscriptions.find(sub => sub.id === agentId)) {
        subscriptions.push({
            id: agentId,
            name: agentName,
            type: priceType,
            price: agentPrice,
            subscribeDate: new Date().toISOString()
        });
        
        localStorage.setItem('agentSubscriptions', JSON.stringify(subscriptions));
    }
}

// ===== AI中心（新三段式）交互函数 =====
function showExamplesModal() {
    const modal = document.getElementById('examplesModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function hideExamplesModal() {
    const modal = document.getElementById('examplesModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function selectExample(question) {
    const inputEl = document.getElementById('aiCenterInput');
    if (inputEl) {
        inputEl.value = question;
        hideExamplesModal();
    }
}

function previewAICenterImages(inputEl) {
    const preview = document.getElementById('aiCenterImagePreview');
    if (!preview) return;
    preview.innerHTML = '';
    const files = Array.from(inputEl.files || []);
    files.slice(0, 3).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = '48px';
            img.style.height = '48px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '8px';
            img.style.marginRight = '6px';
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

function startAICenterChat() {
    const text = (document.getElementById('aiCenterInput') || {}).value || '';
    const conv = createConversation({ title: 'AI对话', inputText: text, images: [] });
    console.log('Start AI center chat:', conv);
    // 进入旧的诊断详情页复用富媒体与进度演示
    loadPage('aiDiagnosis');
}

function openAgentDetail(agentId) {
    // 原型：弹提示并自动将示例加入"我的订阅"以便演示
    showNotification(`打开智能体详情：${agentId}（原型）`, 'success');
    // 标记示例订阅已购
    setTimeout(() => {
        const empty = document.getElementById('subsEmpty');
        const item = document.getElementById('subsExample');
        if (empty && item) {
            empty.style.display = 'none';
            item.style.display = 'block';
        }
    }, 300);
}

// 切换订阅演示状态
function toggleSubscriptionDemo() {
    const empty = document.getElementById('subsEmpty');
    const content = document.getElementById('subsContent');
    const toggleBtn = document.querySelector('.demo-toggle-btn i');
    
    if (empty && content) {
        if (empty.style.display === 'none') {
            // 切换到未订阅状态
            empty.style.display = 'block';
            content.style.display = 'none';
            toggleBtn.className = 'fas fa-toggle-off';
            showNotification('已切换到未订阅状态', 'info');
        } else {
            // 切换到已订阅状态
            empty.style.display = 'none';
            content.style.display = 'block';
            toggleBtn.className = 'fas fa-toggle-on';
            showNotification('已切换到已订阅状态', 'success');
        }
    }
}

// 显示续费弹窗
function showRenewalModal(agentId) {
    const modal = document.getElementById('renewalModal');
    const agentData = getAgentData(agentId);
    
    if (modal && agentData) {
        // 更新弹窗内容
        document.getElementById('renewalAgentIcon').innerHTML = `<i class="${agentData.icon}"></i>`;
        document.getElementById('renewalAgentName').textContent = agentData.name;
        document.getElementById('renewalAgentDesc').textContent = agentData.desc;
        document.getElementById('renewalCurrentStatus').textContent = agentData.status;
        
        modal.style.display = 'flex';
    }
}

// 隐藏续费弹窗
function hideRenewalModal() {
    const modal = document.getElementById('renewalModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 确认续费
function confirmRenewal() {
    const selectedOption = document.querySelector('input[name="renewalOption"]:checked');
    if (selectedOption) {
        const count = selectedOption.value;
        const price = selectedOption.closest('.option-item').dataset.price;
        
        showNotification(`续费成功！已购买${count}次使用机会，花费¥${price}`, 'success');
        hideRenewalModal();
        
        // 这里可以更新页面上的剩余次数显示
        updateRemainingCount(count);
    }
}

// 获取智能体数据
function getAgentData(agentId) {
    const agentData = {
        'pesticide-advisor': {
            icon: 'fas fa-pills',
            name: '用药建议',
            desc: '精准用药指导',
            status: '剩余15次'
        },
        'yield-forecast': {
            icon: 'fas fa-chart-line',
            name: '产量预测',
            desc: 'AI预测作物产量',
            status: '剩余8次'
        }
    };
    
    return agentData[agentId] || {
        icon: 'fas fa-robot',
        name: '智能体',
        desc: '智能体描述',
        status: '剩余0次'
    };
}

// 更新剩余次数（演示用）
function updateRemainingCount(addedCount) {
    // 这里可以更新页面上的剩余次数显示
    showNotification(`剩余次数已更新（演示）`, 'info');
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'info' ? 'info-circle' : type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 全局页面加载函数（供HTML中的onclick调用）
window.loadPage = loadPage;
window.showMessages = showMessages;
window.showComingSoon = showComingSoon; 
window.goBack = function() {
    const phoneContent = document.getElementById('phoneContent');
    if (!window.__pageStack || window.__pageStack.length === 0) {
        // 栈为空，退回到首页
        currentPage = 'home';
        phoneContent.innerHTML = pageData.home.content;
        updateNavigationState('home');
        return;
    }
    const prev = window.__pageStack.pop();
    currentPage = prev;
    phoneContent.innerHTML = pageData[prev].content;
    updateNavigationState(prev);
};

// AI设定相关变量
let currentAIType = '';
let aiAnalysisTimeout = null;

// 显示AI设定弹窗
window.showAIDialog = function(type) {
    currentAIType = type;
    const dialog = document.getElementById('aiDialog');
    if (dialog) {
        dialog.classList.add('show');
        // 模拟AI分析过程
        startAIAnalysis();
    }
};

// 隐藏AI设定弹窗
window.hideAIDialog = function() {
    const dialog = document.getElementById('aiDialog');
    if (dialog) {
        dialog.classList.remove('show');
    }
    if (aiAnalysisTimeout) {
        clearTimeout(aiAnalysisTimeout);
    }
};

// 开始AI分析
function startAIAnalysis() {
    const analysisDiv = document.getElementById('aiAnalysis');
    if (!analysisDiv) return;
    
    // 显示加载状态
    analysisDiv.innerHTML = `
        <div class="ai-loading">
            <i class="fas fa-spinner fa-spin"></i>
            正在分析...
        </div>
    `;
    
    // 模拟AI分析延迟
    aiAnalysisTimeout = setTimeout(() => {
        const cropType = document.getElementById('cropType').value;
        const location = document.getElementById('location').value;
        const plantingPlan = document.getElementById('plantingPlan').value;
        
        // 根据AI类型生成不同的分析结果
        if (currentAIType === 'soil') {
            showSoilAnalysis(cropType, location, plantingPlan);
        } else if (currentAIType === 'crop') {
            showCropAnalysis(cropType, location, plantingPlan);
        }
    }, 2000);
}

// 显示土壤分析结果
function showSoilAnalysis(cropType, location, plantingPlan) {
    const analysisDiv = document.getElementById('aiAnalysis');
    const analysisData = getSoilAnalysisData(cropType, location, plantingPlan);
    
    analysisDiv.innerHTML = `
        <div class="ai-result">
            <div class="ai-result-item ai-suggestion">
                <strong>AI建议:</strong> ${analysisData.suggestion}
            </div>
            <div class="ai-result-item">
                <strong>检测时间:</strong> 施肥后第${analysisData.detectionDay}天
            </div>
            <div class="ai-result-item">
                <strong>检测点位:</strong> ${analysisData.points}个
            </div>
            <div class="ai-result-item">
                <strong>有效区域:</strong> ${analysisData.area}米
            </div>
            <div class="ai-result-item">
                <strong>关键指标:</strong> ${analysisData.indicators.join(', ')}
            </div>
        </div>
    `;
}

// 显示作物分析结果
function showCropAnalysis(cropType, location, plantingPlan) {
    const analysisDiv = document.getElementById('aiAnalysis');
    const analysisData = getCropAnalysisData(cropType, location, plantingPlan);
    
    analysisDiv.innerHTML = `
        <div class="ai-result">
            <div class="ai-result-item ai-suggestion">
                <strong>AI建议:</strong> ${analysisData.suggestion}
            </div>
            <div class="ai-result-item">
                <strong>拍照时间:</strong> 农事活动后第${analysisData.photoDay}天
            </div>
            <div class="ai-result-item">
                <strong>拍照点位:</strong> ${analysisData.points}个
            </div>
            <div class="ai-result-item">
                <strong>有效区域:</strong> ${analysisData.area}米
            </div>
            <div class="ai-result-item">
                <strong>拍照数量:</strong> ${analysisData.photoCount}张/点位
            </div>
        </div>
    `;
}

// 获取土壤分析数据
function getSoilAnalysisData(cropType, location, plantingPlan) {
    // 根据作物类型名称获取对应的英文key
    const cropTypeMap = {
        '小麦': 'wheat',
        '玉米': 'corn',
        '水稻': 'rice',
        '大豆': 'soybean'
    };
    
    const cropKey = cropTypeMap[cropType] || 'wheat';
    
    const data = {
        wheat: {
            detectionDay: 7,
            points: 5,
            area: 50,
            indicators: ['氮', '磷', '钾', 'pH值'],
            suggestion: '小麦生长期需要重点关注氮肥含量，建议增加氮元素检测频率'
        },
        corn: {
            detectionDay: 5,
            points: 6,
            area: 60,
            indicators: ['氮', '磷', '钾', '有机质'],
            suggestion: '玉米对磷肥需求较高，建议重点监测磷元素变化'
        },
        rice: {
            detectionDay: 3,
            points: 4,
            area: 40,
            indicators: ['氮', '钾', 'pH值', '盐分'],
            suggestion: '水稻种植需要控制土壤pH值，建议定期监测酸碱度'
        },
        soybean: {
            detectionDay: 6,
            points: 5,
            area: 45,
            indicators: ['氮', '磷', '钾', '微量元素'],
            suggestion: '大豆固氮能力强，可适当减少氮肥检测频率'
        }
    };
    
    return data[cropKey];
}

// 获取作物分析数据
function getCropAnalysisData(cropType, location, plantingPlan) {
    // 根据作物类型名称获取对应的英文key
    const cropTypeMap = {
        '小麦': 'wheat',
        '玉米': 'corn',
        '水稻': 'rice',
        '大豆': 'soybean'
    };
    
    const cropKey = cropTypeMap[cropType] || 'wheat';
    
    const data = {
        wheat: {
            photoDay: 3,
            points: 3,
            area: 30,
            photoCount: 2,
            suggestion: '小麦分蘖期是关键观察期，建议增加拍照频率'
        },
        corn: {
            photoDay: 5,
            points: 4,
            area: 40,
            photoCount: 3,
            suggestion: '玉米抽雄期需要重点观察，建议多角度拍照'
        },
        rice: {
            photoDay: 2,
            points: 3,
            area: 25,
            photoCount: 2,
            suggestion: '水稻分蘖期生长迅速，建议每日观察记录'
        },
        soybean: {
            photoDay: 4,
            points: 3,
            area: 35,
            photoCount: 2,
            suggestion: '大豆开花期是关键期，建议增加观察密度'
        }
    };
    
    return data[cropKey];
}

// 应用AI设定
window.applyAISettings = function() {
    const cropType = document.getElementById('cropType').value;
    const analysisData = currentAIType === 'soil' ? 
        getSoilAnalysisData(cropType) : 
        getCropAnalysisData(cropType);
    
    // 根据AI类型填充不同的表单
    if (currentAIType === 'soil') {
        // 填充土壤检测表单
        const inputs = document.querySelectorAll('.fieldWorkstation-page input[type="number"]');
        if (inputs.length >= 4) {
            inputs[0].value = analysisData.detectionDay; // 检测天数
            inputs[2].value = analysisData.points; // 点位数量
            inputs[3].value = analysisData.area; // 有效区域
        }
    } else if (currentAIType === 'crop') {
        // 填充作物拍照表单
        const inputs = document.querySelectorAll('.fieldWorkstation-page input[type="number"]');
        if (inputs.length >= 6) {
            inputs[4].value = analysisData.photoDay; // 拍照天数
            inputs[6].value = analysisData.points; // 点位数量
            inputs[7].value = analysisData.area; // 有效区域
            inputs[8].value = analysisData.photoCount; // 拍照数量
        }
    }
    
    // 隐藏弹窗
    hideAIDialog();
    
    // 显示成功提示
    showToast('AI设定已应用');
};

// 显示内嵌式提示卡片
function showInlineNotification(message, type = 'info', targetElement = null) {
    // 移除现有的提示卡片
    const existingNotification = document.querySelector('.inline-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 创建提示卡片
    const notification = document.createElement('div');
    notification.className = `inline-notification inline-notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // 插入到目标元素之前，如果没有目标元素则插入到页面顶部
    if (targetElement) {
        targetElement.parentNode.insertBefore(notification, targetElement);
    } else {
        const phoneContent = document.getElementById('phoneContent');
        if (phoneContent) {
            phoneContent.insertBefore(notification, phoneContent.firstChild);
        }
    }
    
    // 显示动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // 自动隐藏（可选）
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// 显示状态栏提示
function showStatusBarNotification(message, type = 'info') {
    // 移除现有的状态栏提示
    const existingStatusBar = document.querySelector('.status-bar-notification');
    if (existingStatusBar) {
        existingStatusBar.remove();
    }
    
    // 创建状态栏提示
    const statusBar = document.createElement('div');
    statusBar.className = `status-bar-notification status-bar-${type}`;
    statusBar.innerHTML = `
        <div class="status-bar-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 插入到页面顶部
    const phoneContent = document.getElementById('phoneContent');
    if (phoneContent) {
        phoneContent.insertBefore(statusBar, phoneContent.firstChild);
    }
    
    // 显示动画
    setTimeout(() => {
        statusBar.classList.add('show');
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        if (statusBar.parentNode) {
            statusBar.classList.remove('show');
            setTimeout(() => {
                if (statusBar.parentNode) {
                    statusBar.remove();
                }
            }, 300);
        }
    }, 4000);
}

// 保持原有的showToast函数以兼容现有代码
function showToast(message, type = 'info') {
    // 根据消息类型选择不同的展示方式
    if (type === 'success' || type === 'error') {
        showStatusBarNotification(message, type);
    } else {
        showInlineNotification(message, type);
    }
}



// 分享记录
window.shareRecord = function() {
    showToast('农事服务记录分享功能');
};

// 导出报告
window.exportRecord = function() {
    showToast('农事服务报告导出功能');
}; 

// AI语音识别相关变量
let recognition = null;
let isRecording = false;
let isPaused = false;
let recordingTimer = null;
let recordingStartTime = null;
let realtimeTextTimer = null;
let currentText = '';
let inactivityCheckTimer = null; // 30秒未输入检测
let lastRealtimeUpdateTs = 0;
// 根据页面类型动态生成mockTexts
function getMockTextsForCurrentPage() {
    const currentPageElement = document.getElementById('phoneContent');
    const isNewFarmPlan = currentPageElement && currentPageElement.innerHTML.includes('新建农事方案');
    const isFarmPlanStep2 = currentPageElement && currentPageElement.innerHTML.includes('农事方案计划');
    
    if (isNewFarmPlan && !isFarmPlanStep2) {
        // 新建农事方案第一步
        return [
            "我要创建一个水仙花种植方案",
            "我要创建一个水仙花种植方案，方案名称是8月管理1号方案",
            "我要创建一个水仙花种植方案，方案名称是8月管理1号方案，所在区域是大厅水培植物基地",
            "我要创建一个水仙花种植方案，方案名称是8月管理1号方案，所在区域是大厅水培植物基地，种植面积1亩",
            "我要创建一个水仙花种植方案，方案名称是8月管理1号方案，所在区域是大厅水培植物基地，种植面积1亩，预计亩均产量500公斤",
            "我要创建一个水仙花种植方案，方案名称是8月管理1号方案，所在区域是大厅水培植物基地，种植面积1亩，预计亩均产量500公斤，预计亩均成本2000元，预计亩均收入3000元，指导专家是张教授，所属单位是农业技术推广站"
        ];
    } else if (isFarmPlanStep2) {
        // 新建农事方案第二步
        return [
            "我要添加一个打药计划",
            "我要添加一个打药计划，时间是从8月18日到8月20日",
            "我要添加一个打药计划，时间是从8月18日到8月20日，农事类型是打药",
            "我要添加一个打药计划，时间是从8月18日到8月20日，农事类型是打药，活动名称是第一季度打药作业活动",
            "我要添加一个打药计划，时间是从8月18日到8月20日，农事类型是打药，活动名称是第一季度打药作业活动，作物是冬小麦",
            "我要添加一个打药计划，时间是从8月18日到8月20日，农事类型是打药，活动名称是第一季度打药作业活动，作物是冬小麦，建议注意天气条件进行打药作业"
        ];
    } else {
        // 添加农事活动页面
        return [
            "我要为大厅水培植物基地",
            "我要为大厅水培植物基地的水仙花",
            "我要为大厅水培植物基地的水仙花安排打药活动",
            "我要为大厅水培植物基地的水仙花安排打药活动，时间是明天上午9点",
            "我要为大厅水培植物基地的水仙花安排打药活动，时间是明天上午9点到11点",
            "我要为大厅水培植物基地的水仙花安排打药活动，时间是明天上午9点到11点，负责人是王成龙"
        ];
    }
}

let mockTexts = getMockTextsForCurrentPage();
let textIndex = 0;

// 初始化语音识别（模拟版本）
function initSpeechRecognition() {
    console.log('语音识别功能已初始化（模拟模式）');
}

// 开始语音输入
window.startVoiceInput = function() {
    console.log('开始语音输入 - 直接开始录音');
    // 重新获取当前页面的mockTexts
    mockTexts = getMockTextsForCurrentPage();
    textIndex = 0; // 重置文本索引
    
    const modal = document.getElementById('aiVoiceModal');
    if (modal) {
        modal.classList.add('show');
        initSpeechRecognition();
        
        // 显示智能提示
        showSmartHint();
        
        // 直接开始录音，跳过"点击开始录音"步骤
        setTimeout(() => {
            console.log('直接开始录音');
            startRecording();
        }, 100);
    }
};

// 显示智能提示
function showSmartHint() {
    // 移除toast提示，改为在模态框内显示
    console.log('智能提示功能已启用');
}

// 关闭语音弹窗
window.closeVoiceModal = function() {
    const modal = document.getElementById('aiVoiceModal');
    if (modal) {
        modal.classList.remove('show');
        if (isRecording) {
            isRecording = false;
            isPaused = false;
            stopRecordingTimer();
            stopRealtimeText();
            stopInactivityTimer();
        }
    }
};

// 开始录音（模拟版本）
window.startRecording = function() {
    console.log('开始录音（模拟模式）');
    isRecording = true;
    isPaused = false;
    textIndex = 0;
    currentText = '';
    recordingStartTime = Date.now();
    startRecordingTimer();
    startRealtimeText();
    startInactivityTimer();
    lastRealtimeUpdateTs = Date.now();
    console.log('显示录音状态');
    showRecordingState();
};

// 重新录音（模拟版本）
window.reRecord = function() {
    // 清理状态
    isRecording = false;
    isPaused = false;
    stopRecordingTimer();
    stopRealtimeText();
    stopInactivityTimer();
    // 直接重新开始录音
    setTimeout(() => {
        startRecording();
    }, 500);
};

// 确认使用结果
window.confirmResult = function() {
    const resultTextEditable = document.getElementById('resultTextEditable');
    const resultText = resultTextEditable ? resultTextEditable.value.trim() : '';
    
    if (resultText) {
        console.log('用户确认使用编辑后的文本:', resultText);
        
        // 检查是否有编辑
        const originalText = formContext.lastInput ? Object.values(formContext.lastInput).join(' ') : '';
        const hasEdited = resultText !== originalText;
        
        if (hasEdited) {
            showToast('✅ 已使用编辑后的文本进行智能解析', 'success');
        }
        
        // 展示AI处理过渡
        closeVoiceModal();
        showAIProcessing(resultText);
    } else {
        showToast('请先输入或编辑识别结果', 'warning');
    }
};

// 完成录音并进入下一步（模拟）
window.finishRecording = function() {
    // 若还在录音，先停下
    if (isRecording) {
        isRecording = false;
        stopRecordingTimer();
        stopRealtimeText();
    }
    const finalText = document.getElementById('realtimeText')?.textContent || '';
    // 根据当前页面类型提供不同的默认示例
    const currentPageElement = document.getElementById('phoneContent');
    const isNewFarmPlan = currentPageElement && currentPageElement.innerHTML.includes('新建农事方案');
    const isFarmPlanStep2 = currentPageElement && currentPageElement.innerHTML.includes('农事方案计划');
    
    let defaultTranscript;
    if (isNewFarmPlan && !isFarmPlanStep2) {
        // 新建农事方案第一步示例
        defaultTranscript = '我要创建一个水仙花种植方案，方案名称是8月管理1号方案，所在区域是大厅水培植物基地，种植面积1亩，预计亩均产量500公斤，预计亩均成本2000元，预计亩均收入3000元，指导专家是张教授，所属单位是农业技术推广站';
    } else if (isFarmPlanStep2) {
        // 新建农事方案第二步示例
        defaultTranscript = '我要添加一个打药计划，时间是从8月18日到8月20日，农事类型是打药，活动名称是第一季度打药作业活动，作物是冬小麦，建议注意天气条件进行打药作业';
    } else {
        // 原有的添加农事活动示例
        defaultTranscript = '我要为大厅水培植物基地的水仙花安排打药活动，时间是明天上午9点到11点，负责人是王成龙';
    }
    
    const transcript = finalText || defaultTranscript;
    showResultState(transcript);
};

// 展示AI处理过渡
function showAIProcessing(transcript) {
    const modal = document.getElementById('aiProcessingModal');
    const timeline = document.getElementById('processingTimeline').querySelectorAll('.step');
    const varList = document.getElementById('extractedVariables');
    
    if (!modal || !timeline || !varList) return;
    
    // 清理状态
    modal.classList.add('show');
    timeline.forEach(s => s.classList.remove('active'));
    varList.innerHTML = '';
    
    // 检测当前页面类型
    const currentPageElement = document.getElementById('phoneContent');
    const isNewFarmPlan = currentPageElement && currentPageElement.innerHTML.includes('新建农事方案');
    const isFarmPlanStep2 = currentPageElement && currentPageElement.innerHTML.includes('农事方案计划');
    
    let parsed, mapping;
    if (isNewFarmPlan && !isFarmPlanStep2) {
        // 新建农事方案第一步：基础信息
        parsed = parseVoiceToFarmPlanData(transcript);
        mapping = {
            planName: '方案名称',
            location: '所在地域',
            cropType: '种植作物',
            cropVariety: '作物品种',
            startTime: '种植开始时间',
            endTime: '种植结束时间',
            plantingArea: '种植面积',
            expectedYield: '预计亩均产量',
            expectedCost: '预计亩均成本',
            expectedIncome: '预计亩均收入',
            expert: '指导专家',
            organization: '所属单位'
        };
    } else if (isFarmPlanStep2) {
        // 新建农事方案第二步：方案计划
        parsed = parseVoiceToFarmPlanStep2Data(transcript);
        mapping = {
            planStartDate: '计划开始日期',
            planEndDate: '计划结束日期',
            farmActivityType: '农事类型',
            activityName: '活动名称',
            cropType: '作物',
            suggestion: '建议'
        };
    } else {
        // 原有的添加农事活动页面
        parsed = parseVoiceToFormData(transcript);
        mapping = {
            plantingPlan: '种植计划',
            basePlot: '基地地块',
            crop: '作物',
            activityType: '农事类型',
            activityName: '活动名称',
            startTime: '开始时间',
            endTime: '结束时间',
            personInCharge: '负责人',
            remarks: '备注'
        };
    }
    
    const steps = [
        () => timeline[0].classList.add('active'),
        () => timeline[1].classList.add('active'),
        () => {
            timeline[2].classList.add('active');
            // 渲染变量
            Object.keys(parsed).forEach(key => {
                const value = parsed[key];
                if (!value) return;
                const item = document.createElement('div');
                item.className = 'var-item';
                item.innerHTML = `<span class="var-name">${mapping[key] || key}</span><span class="var-value">${value}</span>`;
                varList.appendChild(item);
            });
        },
        () => timeline[3].classList.add('active'),
        () => {
            timeline[4].classList.add('active');
            // 开始3秒倒计时
            startCountdown(() => {
                if (isNewFarmPlan && !isFarmPlanStep2) {
                    fillFarmPlanForm(parsed);
                } else if (isFarmPlanStep2) {
                    createNewFarmPlan(parsed);
                } else {
                    parseAndFillForm(transcript);
                }
                hideAIProcessing();
                showToast(isFarmPlanStep2 ? '农事计划已创建完成！' : '表单已自动填充完成！');
            });
        }
    ];
    
    // 依次推进步骤
    let idx = 0;
    const advance = () => {
        if (idx >= steps.length) return;
        steps[idx++]();
        if (idx < steps.length) setTimeout(advance, 600);
    };
    advance();
}

function hideAIProcessing() {
    const modal = document.getElementById('aiProcessingModal');
    if (modal) modal.classList.remove('show');
}

// 倒计时功能
function startCountdown(callback) {
    let count = 3;
    const timerElement = document.getElementById('countdownTimer');
    
    const countdown = setInterval(() => {
        count--;
        if (timerElement) {
            timerElement.textContent = count;
        }
        
        if (count <= 0) {
            clearInterval(countdown);
            if (callback) callback();
        }
    }, 1000);
}

// 显示初始状态（已废弃，直接开始录音）
function showInitialState() {
    // 不再需要初始状态，直接开始录音
    startRecording();
}

// 显示录音状态
function showRecordingState() {
    console.log('showRecordingState 被调用');
    const recordingElement = document.getElementById('voiceRecording');
    const resultElement = document.getElementById('voiceResult');
    
    console.log('recordingElement:', recordingElement);
    console.log('resultElement:', resultElement);
    
    if (recordingElement) {
        recordingElement.style.display = 'block';
        console.log('设置录音状态为显示');
    }
    if (resultElement) resultElement.style.display = 'none';
}

// 显示结果状态
function showResultState(transcript) {
    const recordingElement = document.getElementById('voiceRecording');
    const resultElement = document.getElementById('voiceResult');
    const resultTextEditable = document.getElementById('resultTextEditable');
    
    if (recordingElement) recordingElement.style.display = 'none';
    if (resultElement) resultElement.style.display = 'block';
    
    if (resultTextEditable) {
        resultTextEditable.value = transcript;
        // 自动聚焦到文本框
        resultTextEditable.focus();
        // 选中所有文本，方便用户编辑
        resultTextEditable.select();
        
        // 添加键盘事件监听
        resultTextEditable.addEventListener('keydown', function(e) {
            // Ctrl+Enter 或 Cmd+Enter 确认使用
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                confirmResult();
            }
            // Esc 键重新录音
            if (e.key === 'Escape') {
                e.preventDefault();
                reRecord();
            }
        });
        
        // 移除快捷键提示，改为在模态框内显示
    }
}

// 显示错误状态
function showErrorState(error) {
    let errorMessage = '语音识别失败';
    switch(error) {
        case 'no-speech':
            errorMessage = '没有检测到语音，请重试';
            break;
        case 'audio-capture':
            errorMessage = '无法访问麦克风，请检查权限';
            break;
        case 'not-allowed':
            errorMessage = '麦克风权限被拒绝';
            break;
        case 'network':
            errorMessage = '网络连接错误';
            break;
    }
    
    showToast(errorMessage);
    // 错误后直接重新开始录音
    setTimeout(() => {
        startRecording();
    }, 1000);
}

// 开始录音计时器
function startRecordingTimer() {
    recordingStartTime = Date.now();
    recordingTimer = setInterval(updateRecordingTime, 1000);
}

// 停止录音计时器
function stopRecordingTimer() {
    if (recordingTimer) {
        clearInterval(recordingTimer);
        recordingTimer = null;
    }
}

// 更新录音时间显示
function updateRecordingTime() {
    if (recordingStartTime) {
        const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('recordingTime').textContent = timeString;
    }
}

// 智能AI解析语音并填充表单
function parseAndFillForm(transcript) {
    console.log('智能解析语音输入:', transcript);
    
    // 显示AI解析开始提示
    showToast('🤖 AI正在智能解析您的语音...', 'info');
    
    // 分析用户意图
    const intent = analyzeUserIntent(transcript);
    console.log('识别到的意图:', intent);
    
    // 解析语音数据
    const parsedData = parseVoiceToFormData(transcript);
    console.log('解析的数据:', parsedData);
    
    // 显示解析结果
    setTimeout(() => {
        const intentText = intent.type === INTENT_TYPES.MODIFY_FIELD ? '修改模式' : 
                          intent.type === INTENT_TYPES.CORRECT_ERROR ? '纠正模式' : '全新输入模式';
        showToast(`🔍 AI识别：${intentText}，置信度：${Math.round(intent.confidence * 100)}%`, 'info');
    }, 500);
    
    // 智能填充表单
    setTimeout(() => {
        smartFillForm(parsedData, intent);
    }, 1000);
    
    // 更新上下文
    updateFormContext(parsedData, intent);
}

// 意图类型定义
const INTENT_TYPES = {
    NEW_INPUT: 'new_input',      // 全新输入
    MODIFY_FIELD: 'modify_field', // 修改特定字段
    CORRECT_ERROR: 'correct_error' // 纠正错误
};

// 字段关键词映射
const FIELD_KEYWORDS = {
    'crop': ['作物', '种植', '品种', '植物', '种什么'],
    'activityType': ['农事类型', '活动类型', '作业类型', '做什么'],
    'activityName': ['活动名称', '作业名称', '叫什么'],
    'startTime': ['开始时间', '开始', '时间', '什么时候'],
    'endTime': ['结束时间', '结束', '到几点'],
    'basePlot': ['基地', '地块', '区域', '分区', '在哪里'],
    'person': ['负责人', '谁负责', '谁来', '负责人是谁']
};

// 表单上下文管理
let formContext = {
    lastInput: null,
    filledFields: {},
    modificationHistory: [],
    lastModificationTime: null
};

// 分析用户意图
function analyzeUserIntent(transcript) {
    console.log('分析用户意图:', transcript);
    
    // 检查是否有明确修改意图
    const modifyKeywords = ['修改', '更改', '错了', '不对', '应该是', '改成', '不是', '而是', '改为'];
    const hasModifyIntent = modifyKeywords.some(keyword => 
        transcript.includes(keyword)
    );
    
    // 检查是否有纠正错误意图
    const correctKeywords = ['错了', '不对', '不是', '而是', '应该是'];
    const hasCorrectIntent = correctKeywords.some(keyword => 
        transcript.includes(keyword)
    );
    
    // 识别具体要修改的字段
    const targetFields = identifyTargetFields(transcript);
    console.log('识别到的目标字段:', targetFields);
    
    // 判断意图类型
    if (hasCorrectIntent && targetFields.length > 0) {
        return {
            type: INTENT_TYPES.CORRECT_ERROR,
            targetFields: targetFields,
            confidence: 0.9
        };
    } else if (hasModifyIntent && targetFields.length > 0) {
        return {
            type: INTENT_TYPES.MODIFY_FIELD,
            targetFields: targetFields,
            confidence: 0.8
        };
    } else {
        return {
            type: INTENT_TYPES.NEW_INPUT,
            targetFields: Object.keys(FIELD_KEYWORDS),
            confidence: 0.7
        };
    }
}

// 识别目标字段
function identifyTargetFields(transcript) {
    const targetFields = [];
    
    Object.keys(FIELD_KEYWORDS).forEach(fieldId => {
        const keywords = FIELD_KEYWORDS[fieldId];
        const hasKeyword = keywords.some(keyword => 
            transcript.includes(keyword)
        );
        
        if (hasKeyword) {
            targetFields.push(fieldId);
        }
    });
    
    return targetFields;
}

// 智能填充表单
function smartFillForm(parsedData, intent) {
    console.log('智能填充表单:', parsedData, intent);
    
    if (intent.type === INTENT_TYPES.MODIFY_FIELD || intent.type === INTENT_TYPES.CORRECT_ERROR) {
        // 只更新指定字段
        intent.targetFields.forEach(fieldId => {
            if (parsedData[fieldId]) {
                updateField(fieldId, parsedData[fieldId], 'modify');
            }
        });
        
        // 显示修改提示
        showModificationHint(intent.targetFields, parsedData);
    } else {
        // 全新输入，填充所有字段
        Object.keys(parsedData).forEach(fieldId => {
            updateField(fieldId, parsedData[fieldId], 'new');
        });
        
        // 显示填充提示
        showFillHint(Object.keys(parsedData), parsedData);
    }
}

// 更新字段
function updateField(fieldId, value, updateType) {
    const element = document.getElementById(fieldId);
    if (element) {
        // 添加修改动画
        element.classList.add('field-updating');
        element.value = value;
        
        // 更新上下文
        formContext.filledFields[fieldId] = value;
        
        // 移除动画
        setTimeout(() => {
            element.classList.remove('field-updating');
        }, 500);
        
        console.log(`${updateType === 'modify' ? '修改' : '填充'}字段 ${fieldId}: ${value}`);
    }
}

// 显示修改提示
function showModificationHint(targetFields, parsedData) {
    const fieldNames = {
        'crop': '作物',
        'activityType': '农事类型',
        'activityName': '活动名称',
        'startTime': '开始时间',
        'endTime': '结束时间',
        'basePlot': '基地地块',
        'person': '负责人'
    };
    
    const modifiedFields = targetFields.map(fieldId => {
        const fieldName = fieldNames[fieldId] || fieldId;
        const newValue = parsedData[fieldId];
        return `${fieldName}(${newValue})`;
    }).join('、');
    
    const message = `✅ 智能修改：${modifiedFields}`;
    showToast(message, 'success');
    
    // 显示详细信息
    setTimeout(() => {
        const detailMessage = `AI识别到您要修改特定字段，已智能更新相关内容`;
        showToast(detailMessage, 'info');
    }, 1000);
}

// 显示填充提示
function showFillHint(filledFields, parsedData) {
    const fieldNames = {
        'crop': '作物',
        'activityType': '农事类型',
        'activityName': '活动名称',
        'startTime': '开始时间',
        'endTime': '结束时间',
        'basePlot': '基地地块',
        'person': '负责人'
    };
    
    const filledFieldNames = filledFields.map(fieldId => {
        const fieldName = fieldNames[fieldId] || fieldId;
        const value = parsedData[fieldId];
        return `${fieldName}(${value})`;
    }).join('、');
    
    const message = `🎯 智能填充：${filledFieldNames}`;
    showToast(message, 'success');
    
    // 显示详细信息
    setTimeout(() => {
        const detailMessage = `AI已识别并填充所有相关字段，您可以继续修改或确认`;
        showToast(detailMessage, 'info');
    }, 1000);
}

// 更新表单上下文
function updateFormContext(newData, intent) {
    formContext.lastInput = newData;
    formContext.lastModificationTime = Date.now();
    
    formContext.modificationHistory.push({
        timestamp: Date.now(),
        intent: intent,
        changes: newData
    });
    
    // 保持历史记录在合理范围内
    if (formContext.modificationHistory.length > 10) {
        formContext.modificationHistory.shift();
    }
    
    console.log('更新表单上下文:', formContext);
}

// 语音解析为表单数据
function parseVoiceToFormData(transcript) {
    const data = {};
    
    // 解析基地地块
    const basePlotMatch = transcript.match(/(大厅水培植物|基地|地块)/g);
    if (basePlotMatch) {
        data.basePlot = '大厅水培植物 | 一号分区 | 一号基地(水培区 | 一号地块)';
    }
    
    // 解析作物 - 增强识别
    const cropMatch = transcript.match(/(水仙花|小麦|玉米|水稻|大豆|冬小麦|春小麦|棉花|蔬菜|水果)/);
    if (cropMatch) {
        data.crop = cropMatch[0];
    }
    
    // 解析农事类型 - 增强识别
    const activityTypeMatch = transcript.match(/(打药|施肥|浇水|除草|播种|收获|修剪|采摘|移栽|松土)/);
    if (activityTypeMatch) {
        data.activityType = activityTypeMatch[0];
    }
    
    // 解析活动名称
    if (activityTypeMatch) {
        data.activityName = `${activityTypeMatch[0]}活动`;
    }
    
    // 解析时间 - 增强识别
    const timeMatch = transcript.match(/(明天|今天|后天)?\s*(上午|下午|晚上)?\s*(\d{1,2})[点时:：](\d{0,2})?\s*(到|至)\s*(\d{1,2})[点时:：](\d{0,2})?/);
    if (timeMatch) {
        const startHour = timeMatch[3];
        const startMinute = timeMatch[4] || '00';
        const endHour = timeMatch[6];
        const endMinute = timeMatch[7] || '00';
        
        // 处理上午下午
        let startTime = `${startHour.padStart(2, '0')}:${startMinute}`;
        let endTime = `${endHour.padStart(2, '0')}:${endMinute}`;
        
        if (timeMatch[2] === '下午' || timeMatch[2] === '晚上') {
            startTime = `${parseInt(startHour) + 12}:${startMinute}`;
            endTime = `${parseInt(endHour) + 12}:${endMinute}`;
        }
        
        data.startTime = startTime;
        data.endTime = endTime;
    }
    
    // 解析负责人 - 增强识别
    const personMatch = transcript.match(/(王成龙|张三|李四|王五|赵六|钱七|孙八|周九|吴十)/);
    if (personMatch) {
        data.personInCharge = personMatch[0];
    }
    
    // 解析种植计划
    if (data.crop && data.activityType) {
        data.plantingPlan = `${data.crop}${data.activityType}计划`;
    }
    
    // 解析备注
    const remarksMatch = transcript.match(/(备注|说明|注意|要求)[：:]\s*(.+)/);
    if (remarksMatch) {
        data.remarks = remarksMatch[2];
    }
    
    return data;
}

// 解析语音到农事方案基础信息数据
function parseVoiceToFarmPlanData(transcript) {
    const data = {};
    
    // 智能检测：如果语音内容明显是农事活动相关，尝试转换为方案信息
    if (transcript.includes('安排') && transcript.includes('活动')) {
        // 从农事活动语音中提取方案信息
        const cropMatch = transcript.match(/(水仙花|小麦|玉米|水稻|大豆|冬小麦|春小麦|花卉|番茄|黄瓜|白菜|萝卜)/);
        if (cropMatch) {
            data.cropType = cropMatch[0];
            data.planName = `${cropMatch[0]}种植方案`;
        }
        
        // 提取基地信息作为所在地域
        if (transcript.includes('大厅水培植物基地')) {
            data.location = '大厅水培植物基地';
        }
        
        // 提取时间信息
        const timeMatch = transcript.match(/(明天|后天|下周|下个月|本月)?\s*(上午|下午|晚上)?\s*(\d{1,2})[点时:：](\d{0,2})?\s*(到|至)\s*(\d{1,2})[点时:：](\d{0,2})?/);
        if (timeMatch) {
            const startHour = timeMatch[3];
            const startMinute = timeMatch[4] || '00';
            const endHour = timeMatch[6];
            const endMinute = timeMatch[7] || '00';
            
            let startTime = `${startHour.padStart(2, '0')}:${startMinute}`;
            let endTime = `${endHour.padStart(2, '0')}:${endMinute}`;
            
            if (timeMatch[2] === '下午' || timeMatch[2] === '晚上') {
                startTime = `${parseInt(startHour) + 12}:${startMinute}`;
                endTime = `${parseInt(endHour) + 12}:${endMinute}`;
            }
            
            data.startTime = startTime;
            data.endTime = endTime;
        }
        
        // 提取负责人信息
        const personMatch = transcript.match(/(负责人|负责人是|负责人为)([^，,。!！\s]*)/);
        if (personMatch) {
            data.expert = personMatch[2];
        }
        
        // 设置默认值
        if (!data.plantingArea) data.plantingArea = '1亩';
        if (!data.expectedYield) data.expectedYield = '500';
        if (!data.expectedCost) data.expectedCost = '2000';
        if (!data.expectedIncome) data.expectedIncome = '3000';
        if (!data.cropVariety) data.cropVariety = '1号';
        if (!data.organization) data.organization = '农业技术推广站';
        
        return data;
    }
    
    // 原有的方案信息解析逻辑
    // 解析方案名称 - 更宽泛的匹配
    const planNameMatch = transcript.match(/(方案名称是|叫做|命名为|创建|建立|制定)([^，,。!！]*[方案计划])/);
    if (planNameMatch) {
        data.planName = planNameMatch[2].trim();
    } else if (transcript.includes('方案')) {
        // 从语音中提取作物名称来生成方案名称
        const cropMatch = transcript.match(/(水仙花|小麦|玉米|水稻|大豆|冬小麦|春小麦|花卉)/);
        if (cropMatch) {
            data.planName = `${cropMatch[0]}种植方案`;
        } else {
            data.planName = '农事种植方案';
        }
    }
    
    // 解析所在地域 - 更灵活的匹配
    const locationMatch = transcript.match(/(所在地域|地区|区域|地方|位置)[是在为：:]?\s*([^，,。!！\s]*[省市县区乡镇村])/);
    if (locationMatch) {
        data.location = locationMatch[2];
    } else {
        // 尝试匹配地名模式
        const placeMatch = transcript.match(/([^，,。!！\s]*[省市县区乡镇村])/);
        if (placeMatch) {
            data.location = placeMatch[0];
        } else if (transcript.includes('大厅') || transcript.includes('基地')) {
            data.location = '大厅水培植物基地';
        }
    }
    
    // 解析种植作物 - 扩展匹配范围
    const cropMatch = transcript.match(/(水仙花|小麦|玉米|水稻|大豆|冬小麦|春小麦|花卉|番茄|黄瓜|白菜|萝卜)/);
    if (cropMatch) {
        data.cropType = cropMatch[0];
    }
    
    // 解析作物品种 - 更灵活的数字匹配
    const varietyMatch = transcript.match(/(品种是|品种为|品种)([^，,。!！\s]*[号])/);
    if (varietyMatch) {
        data.cropVariety = varietyMatch[2];
    } else {
        // 匹配数字+号的模式
        const numberMatch = transcript.match(/([0-9一二三四五六七八九十]+)[号]/);
        if (numberMatch) {
            data.cropVariety = numberMatch[0];
        }
    }
    
    // 解析种植面积 - 支持多种表达方式
    const areaMatch = transcript.match(/([0-9一二三四五六七八九十]+)\s*(亩|平方米|公顷)/);
    if (areaMatch) {
        let area = areaMatch[1];
        // 转换中文数字
        const chineseNumbers = {'一': '1', '二': '2', '三': '3', '四': '4', '五': '5', '六': '6', '七': '7', '八': '8', '九': '9', '十': '10'};
        if (chineseNumbers[area]) {
            area = chineseNumbers[area];
        }
        data.plantingArea = area + areaMatch[2];
    }
    
    // 解析预计亩均产量 - 更全面的单位支持
    const yieldMatch = transcript.match(/(产量|亩产|收成)[是为：:]?\s*([0-9]+)\s*(公斤|千克|kg|斤|吨)/);
    if (yieldMatch) {
        data.expectedYield = yieldMatch[2];
    } else {
        // 直接匹配数字+重量单位
        const directYieldMatch = transcript.match(/([0-9]+)\s*(公斤|千克|kg)/);
        if (directYieldMatch) {
            data.expectedYield = directYieldMatch[1];
        }
    }
    
    // 解析预计亩均成本 - 支持多种表达
    const costMatch = transcript.match(/(成本|投入|费用)[是为：:]?\s*([0-9]+)\s*元/);
    if (costMatch) {
        data.expectedCost = costMatch[2];
    } else {
        // 匹配"X元成本"的模式
        const reverseCostMatch = transcript.match(/([0-9]+)\s*元\s*(成本|投入|费用)/);
        if (reverseCostMatch) {
            data.expectedCost = reverseCostMatch[1];
        }
    }
    
    // 解析预计亩均收入 - 支持多种表达
    const incomeMatch = transcript.match(/(收入|收益|利润)[是为：:]?\s*([0-9]+)\s*元/);
    if (incomeMatch) {
        data.expectedIncome = incomeMatch[2];
    } else {
        // 匹配"X元收入"的模式
        const reverseIncomeMatch = transcript.match(/([0-9]+)\s*元\s*(收入|收益|利润)/);
        if (reverseIncomeMatch) {
            data.expectedIncome = reverseIncomeMatch[1];
        }
    }
    
    // 解析指导专家 - 扩展姓名匹配
    const expertMatch = transcript.match(/(指导专家|专家|负责人)[是为：:]?\s*([^，,。!！\s]*[授师长生员]|[王李张刘陈杨赵黄周吴徐孙胡朱高林何郭马罗梁][^，,。!！\s]*)/);
    if (expertMatch) {
        data.expert = expertMatch[2];
    }
    
    // 解析所属单位 - 扩展机构匹配
    const orgMatch = transcript.match(/(所属单位|单位|机构|组织)[是为：:]?\s*([^，,。!！\s]*[站所院校司厂社区村委会])/);
    if (orgMatch) {
        data.organization = orgMatch[2];
    } else {
        // 匹配常见机构后缀
        const institutionMatch = transcript.match(/([^，,。!！\s]*[站所院校司厂社区村委会])/);
        if (institutionMatch) {
            data.organization = institutionMatch[0];
        }
    }
    
    // 解析种植周期 - 支持多种日期格式
    const timeRangeMatch = transcript.match(/(\d{1,2}月\d{1,2}日?)[到至~](\d{1,2}月\d{1,2}日?)/);
    if (timeRangeMatch) {
        data.startTime = timeRangeMatch[1];
        data.endTime = timeRangeMatch[2];
    } else {
        // 匹配年份+月日的格式
        const yearTimeMatch = transcript.match(/(20\d{2}年)?(\d{1,2}月\d{1,2}日?)[到至~](20\d{2}年)?(\d{1,2}月\d{1,2}日?)/);
        if (yearTimeMatch) {
            data.startTime = yearTimeMatch[2];
            data.endTime = yearTimeMatch[4];
        }
    }
    
    return data;
}

// 解析语音到农事方案计划数据
function parseVoiceToFarmPlanStep2Data(transcript) {
    const data = {};
    
    // 解析日期范围 - 支持更多格式
    const dateRangeMatch = transcript.match(/(\d{1,2}月\d{1,2}日?)[到至~](\d{1,2}月\d{1,2}日?)/);
    if (dateRangeMatch) {
        data.planStartDate = '当年' + dateRangeMatch[1];
        data.planEndDate = '当年' + dateRangeMatch[2];
    } else {
        // 匹配相对时间表达
        const relativeTimeMatch = transcript.match(/(明天|后天|下周|下个月|本月)/);
        if (relativeTimeMatch) {
            const today = new Date();
            let startDate, endDate;
            
            switch(relativeTimeMatch[1]) {
                case '明天':
                    startDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
                    endDate = startDate;
                    break;
                case '后天':
                    startDate = new Date(today.getTime() + 48 * 60 * 60 * 1000);
                    endDate = startDate;
                    break;
                default:
                    startDate = today;
                    endDate = today;
            }
            
            const formatDate = (date) => `${date.getMonth() + 1}月${date.getDate()}日`;
            data.planStartDate = '当年' + formatDate(startDate);
            data.planEndDate = '当年' + formatDate(endDate);
        }
    }
    
    // 解析农事类型 - 扩展类型识别
    const activityTypeMatch = transcript.match(/(打药|施肥|浇水|除草|播种|收获|修剪|松土|灌溉|翻地|间苗|移栽|嫁接)/);
    if (activityTypeMatch) {
        data.farmActivityType = activityTypeMatch[0];
    } else {
        // 通过动作词推断农事类型
        if (transcript.includes('安排') && transcript.includes('活动')) {
            const actionMatch = transcript.match(/(安排|进行|执行)([^，,。!！]*)(活动|作业|工作)/);
            if (actionMatch) {
                const action = actionMatch[2];
                if (action.includes('药')) data.farmActivityType = '打药';
                else if (action.includes('肥')) data.farmActivityType = '施肥';
                else if (action.includes('水')) data.farmActivityType = '浇水';
                else if (action.includes('草')) data.farmActivityType = '除草';
            }
        }
    }
    
    // 解析活动名称 - 更智能的生成
    const activityNameMatch = transcript.match(/(活动名称|名称)[是为：:]?\s*([^，,。!！]*)/);
    if (activityNameMatch && activityNameMatch[2].trim()) {
        data.activityName = activityNameMatch[2].trim();
    } else if (data.farmActivityType) {
        // 根据时间和类型智能生成名称
        const seasonMap = {
            '春': ['3月', '4月', '5月'],
            '夏': ['6月', '7月', '8月'],
            '秋': ['9月', '10月', '11月'],
            '冬': ['12月', '1月', '2月']
        };
        
        let season = '第一季度';
        const currentMonth = new Date().getMonth() + 1;
        for (const [seasonName, months] of Object.entries(seasonMap)) {
            if (months.some(m => m.includes(currentMonth.toString()))) {
                season = seasonName + '季';
                break;
            }
        }
        
        data.activityName = `${season} | ${data.farmActivityType}作业活动`;
    } else {
        data.activityName = '农事管理活动';
    }
    
    // 解析作物 - 扩展作物识别
    const cropMatch = transcript.match(/(作物|种植)[是为：:]?\s*([^，,。!！\s]*[麦花稻豆菜瓜果])/);
    if (cropMatch) {
        data.cropType = cropMatch[2];
    } else {
        // 直接匹配作物名称
        const directCropMatch = transcript.match(/(水仙花|小麦|玉米|水稻|大豆|冬小麦|春小麦|花卉|番茄|黄瓜|白菜|萝卜)/);
        if (directCropMatch) {
            data.cropType = directCropMatch[0];
        }
    }
    
    // 解析建议 - 更智能的建议生成
    const suggestionMatch = transcript.match(/(建议|推荐|提示)[是为进行：:]?\s*([^，,。!！]*)/);
    if (suggestionMatch && suggestionMatch[2].trim()) {
        data.suggestion = suggestionMatch[2].trim();
    } else if (data.farmActivityType) {
        // 根据农事类型生成具体建议
        const suggestionMap = {
            '打药': '注意天气条件，选择无风晴天进行打药作业',
            '施肥': '根据土壤肥力检测结果，合理配比肥料用量',
            '浇水': '根据土壤湿度和天气情况，适量浇水',
            '除草': '人工除草结合机械除草，保护作物根系',
            '播种': '选择优质种子，注意播种深度和密度',
            '收获': '选择适宜天气，及时收获确保品质'
        };
        data.suggestion = suggestionMap[data.farmActivityType] || `${data.farmActivityType}作业`;
    } else {
        data.suggestion = '按标准流程执行';
    }
    
    return data;
}

// 填充农事方案表单
function fillFarmPlanForm(data) {
    const fieldMapping = {
        planName: 'planName',
        location: 'location',
        cropType: 'cropType',
        cropVariety: 'cropVariety',
        startTime: 'startTime',
        endTime: 'endTime',
        plantingArea: 'plantingArea',
        expectedYield: 'expectedYield',
        expectedCost: 'expectedCost',
        expectedIncome: 'expectedIncome',
        expert: 'expert',
        organization: 'organization'
    };
    
    Object.keys(fieldMapping).forEach(key => {
        const value = data[key];
        const fieldId = fieldMapping[key];
        if (value && fieldId) {
            const element = document.getElementById(fieldId);
            if (element) {
                element.value = value;
                element.classList.add('ai-filled');
                // 移除动画类
                setTimeout(() => element.classList.remove('ai-filled'), 500);
            }
        }
    });
}

// 创建新的农事计划
function createNewFarmPlan(data) {
    // 这里可以实现创建新计划卡片的逻辑
    console.log('创建新的农事计划:', data);
    
    // 模拟添加新计划卡片到页面
    const planSection = document.querySelector('.mobile-content');
    if (planSection && data.farmActivityType) {
        const newPlanCard = document.createElement('div');
        newPlanCard.className = 'plan-card';
        newPlanCard.innerHTML = `
            <div class="plan-card-header">
                <div class="plan-date">
                    <i class="fas fa-clock"></i>
                    <span>${data.planStartDate || '当年08月18日'}~${data.planEndDate || '当年08月20日'}</span>
                </div>
                <div class="plan-options">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            <div class="plan-card-content">
                <div class="plan-detail-item">
                    <span class="detail-label">农事类型:</span>
                    <span class="detail-value">${data.farmActivityType || '打药'}</span>
                </div>
                <div class="plan-detail-item">
                    <span class="detail-label">活动名称:</span>
                    <span class="detail-value">${data.activityName || '新增农事活动'}</span>
                </div>
                <div class="plan-detail-item">
                    <span class="detail-label">作物:</span>
                    <span class="detail-value">${data.cropType || '冬小麦'}</span>
                </div>
                <div class="plan-detail-item">
                    <span class="detail-label">建议:</span>
                    <span class="detail-value">${data.suggestion || '按计划执行'}</span>
                </div>
            </div>
        `;
        
        // 添加动画效果
        newPlanCard.style.opacity = '0';
        newPlanCard.style.transform = 'translateY(20px)';
        
        // 插入到现有计划卡片后面
        const existingCard = planSection.querySelector('.plan-card');
        if (existingCard) {
            existingCard.parentNode.insertBefore(newPlanCard, existingCard.nextSibling);
        } else {
            planSection.appendChild(newPlanCard);
        }
        
        // 显示动画
        setTimeout(() => {
            newPlanCard.style.transition = 'all 0.3s ease';
            newPlanCard.style.opacity = '1';
            newPlanCard.style.transform = 'translateY(0)';
        }, 100);
    }
}

// 页面加载完成后初始化语音识别
document.addEventListener('DOMContentLoaded', function() {
    // 原有的初始化代码...
    
    // 初始化语音识别
    initSpeechRecognition();
});

// 暂停录音
window.pauseRecording = function() {
    if (isRecording && !isPaused) {
        isPaused = true;
        stopRealtimeText();
        stopInactivityTimer();
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('continueBtn').style.display = 'flex';
        document.querySelector('.recording-text').textContent = '录音已暂停';
    }
};

// 继续录音
window.continueRecording = function() {
    if (isRecording && isPaused) {
        isPaused = false;
        startRealtimeText();
        startInactivityTimer();
        lastRealtimeUpdateTs = Date.now();
        document.getElementById('pauseBtn').style.display = 'flex';
        document.getElementById('continueBtn').style.display = 'none';
        document.querySelector('.recording-text').textContent = '正在录音，请说话...';
    }
};

// 开始实时回显文字
function startRealtimeText() {
    if (realtimeTextTimer) {
        clearInterval(realtimeTextTimer);
    }
    
    realtimeTextTimer = setInterval(() => {
        if (isRecording && !isPaused && textIndex < mockTexts.length) {
            currentText = mockTexts[textIndex];
            const realtimeTextElement = document.getElementById('realtimeText');
            if (realtimeTextElement) {
                realtimeTextElement.textContent = currentText;
                realtimeTextElement.classList.add('typing');
            }
            textIndex++;
            lastRealtimeUpdateTs = Date.now();
        }
    }, 1000); // 每秒更新一次文字
}

// 停止实时回显文字
function stopRealtimeText() {
    if (realtimeTextTimer) {
        clearInterval(realtimeTextTimer);
        realtimeTextTimer = null;
    }
    
    const realtimeTextElement = document.getElementById('realtimeText');
    if (realtimeTextElement) {
        realtimeTextElement.classList.remove('typing');
    }
}

// 未录入超时检测（30秒）
function startInactivityTimer() {
    stopInactivityTimer();
    inactivityCheckTimer = setInterval(() => {
        if (!isRecording || isPaused) return;
        const now = Date.now();
        if (now - lastRealtimeUpdateTs >= 30000) { // 30秒无更新
            isRecording = false;
            stopRecordingTimer();
            stopRealtimeText();
            stopInactivityTimer();
            const realtimeTextElement = document.getElementById('realtimeText');
            if (realtimeTextElement && realtimeTextElement.textContent.trim() === '') {
                // 完全没有内容
                showToast('长时间未录入，已停止录入');
            } else {
                // 有部分内容，仍提示停止
                showToast('长时间未录入，已停止录入');
            }
            // 超时后直接重新开始录音
            setTimeout(() => {
                startRecording();
            }, 2000);
        }
    }, 1000);
}

function stopInactivityTimer() {
    if (inactivityCheckTimer) {
        clearInterval(inactivityCheckTimer);
        inactivityCheckTimer = null;
    }
}

// ===== 分享功能 =====
let currentShareType = '';
let currentShareTitle = '';

// 显示分享选项弹窗
function showShareModal(type, title) {
    currentShareType = type;
    currentShareTitle = title;
    
    // 创建遮罩层和弹窗
    const modalHTML = `
        <div class="share-modal-overlay" id="shareModalOverlay" onclick="closeShareModal()">
            <div class="share-modal" onclick="event.stopPropagation()">
                <div class="share-modal-header">
                    <h3>分享到</h3>
                    <button class="share-close-btn" onclick="closeShareModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="share-options">
                    <div class="share-option" onclick="shareToWechat()">
                        <div class="share-icon wechat">
                            <i class="fab fa-weixin"></i>
                        </div>
                        <span>微信</span>
                    </div>
                    <div class="share-option" onclick="shareToMoments()">
                        <div class="share-icon moments">
                            <i class="fas fa-circle-notch"></i>
                        </div>
                        <span>朋友圈</span>
                    </div>
                    <div class="share-option" onclick="shareToDouyin()">
                        <div class="share-icon douyin">
                            <i class="fas fa-music"></i>
                        </div>
                        <span>抖音</span>
                    </div>
                    <div class="share-option" onclick="shareToImage()">
                        <div class="share-icon image">
                            <i class="fas fa-image"></i>
                        </div>
                        <span>生成图片</span>
                    </div>
                    <div class="share-option" onclick="copyLink()">
                        <div class="share-icon link">
                            <i class="fas fa-link"></i>
                        </div>
                        <span>复制链接</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 插入到手机屏幕内
    const phoneContent = document.getElementById('phoneContent');
    if (phoneContent) {
        phoneContent.insertAdjacentHTML('beforeend', modalHTML);
    }
}

// 关闭分享弹窗
function closeShareModal() {
    const overlay = document.getElementById('shareModalOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// 分享到微信
function shareToWechat() {
    closeShareModal();
    loadPage('wechatShare');
}

// 分享到朋友圈
function shareToMoments() {
    closeShareModal();
    showNotification('朋友圈分享功能已触发，图片已保存', 'success');
    shareToImage();
}

// 分享到抖音
function shareToDouyin() {
    closeShareModal();
    showNotification('抖音分享功能已触发，跳转到抖音...', 'info');
    setTimeout(() => {
        showNotification('图片已保存到相册，请在抖音中选择', 'success');
    }, 1500);
}

// 生成分享图片
function shareToImage() {
    closeShareModal();
    showPosterModal();
}

// 显示海报预览弹窗
function showPosterModal() {
    const posterContent = currentShareType === 'shop' ? getShopPosterHTML() : getProductPosterHTML();
    
    const modalHTML = `
        <div class="poster-modal-overlay" id="posterModalOverlay" onclick="closePosterModal()">
            <div class="poster-modal" onclick="event.stopPropagation()">
                <div class="poster-modal-header">
                    <h3>分享海报</h3>
                    <button class="poster-close-btn" onclick="closePosterModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="poster-modal-content">
                    ${posterContent}
                </div>
                <div class="poster-modal-footer">
                    <button class="poster-save-btn" onclick="savePosterFromModal()">
                        <i class="fas fa-download"></i> 保存图片
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const phoneContent = document.getElementById('phoneContent');
    if (phoneContent) {
        phoneContent.insertAdjacentHTML('beforeend', modalHTML);
    }
}

// 关闭海报弹窗
function closePosterModal() {
    const overlay = document.getElementById('posterModalOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// 从弹窗保存海报
function savePosterFromModal() {
    showNotification('海报已保存到相册', 'success');
    setTimeout(() => {
        closePosterModal();
    }, 1000);
}

// 生成店铺海报HTML
function getShopPosterHTML() {
    return `
        <div class="poster-card shop-poster">
            <div class="poster-top-banner">
                <div class="banner-badge">源直达</div>
                <h2 class="poster-title">农跃帮小店</h2>
                <div class="poster-subtitle">新鲜农产品·专业农资·智能农机</div>
            </div>
            
            <div class="poster-products">
                <div class="poster-product-row">
                    <div class="poster-product-item">
                        <div class="poster-product-img">
                            <i class="fas fa-helicopter"></i>
                        </div>
                        <div class="poster-product-name">无人机撒药</div>
                        <div class="poster-product-price">¥20元/亩</div>
                    </div>
                    <div class="poster-product-item">
                        <div class="poster-product-img">
                            <i class="fas fa-helicopter"></i>
                        </div>
                        <div class="poster-product-name">无人机巡田</div>
                        <div class="poster-product-price">¥23元/亩</div>
                    </div>
                </div>
                <div class="poster-product-row">
                    <div class="poster-product-item">
                        <div class="poster-product-img">
                            <i class="fas fa-tractor"></i>
                        </div>
                        <div class="poster-product-name">拖拉机耕地</div>
                        <div class="poster-product-price">¥45元/亩</div>
                    </div>
                    <div class="poster-product-item">
                        <div class="poster-product-img">
                            <i class="fas fa-tractor"></i>
                        </div>
                        <div class="poster-product-name">联合收割机</div>
                        <div class="poster-product-price">¥58元/亩</div>
                    </div>
                </div>
            </div>
            
            <div class="poster-bottom">
                <div class="poster-qr">
                    <div class="qr-code">
                        <i class="fas fa-qrcode"></i>
                    </div>
                    <div class="qr-text">长按识别二维码<br>进店选购</div>
                </div>
                <div class="poster-slogan">
                    <div class="slogan-big">引领农业未来</div>
                    <div class="slogan-small">让农业更美好</div>
                </div>
            </div>
        </div>
    `;
}

// 生成商品海报HTML
function getProductPosterHTML() {
    return `
        <div class="poster-card product-poster">
            <div class="product-poster-header">
                <h2 class="poster-product-title">爆款直降</h2>
                <div class="poster-product-subtitle">精选农资 低价抢鲜</div>
            </div>
            
            <div class="product-poster-main">
                <div class="main-product-display">
                    <div class="main-product-img">
                        <img src="玉米病虫害01.png" alt="商品" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                        <div class="placeholder-img" style="display:none;">
                            <i class="fas fa-box"></i>
                        </div>
                    </div>
                    <div class="main-product-info">
                        <h3>史丹利高效氯氰菊酯</h3>
                        <div class="product-features">
                            <span class="feature-tag">高效杀虫</span>
                            <span class="feature-tag">低毒环保</span>
                            <span class="feature-tag">持效期长</span>
                        </div>
                        <div class="product-spec">规格：500ml</div>
                        <div class="product-poster-price">
                            <span class="price-label">限时特惠</span>
                            <span class="price-value">¥25<span class="price-unit">元</span></span>
                            <span class="original-price">¥88</span>
                        </div>
                    </div>
                </div>
                
                <div class="product-highlights">
                    <div class="highlight-item">
                        <i class="fas fa-shield-alt"></i>
                        <span>正品保证</span>
                    </div>
                    <div class="highlight-item">
                        <i class="fas fa-shipping-fast"></i>
                        <span>限时包邮</span>
                    </div>
                    <div class="highlight-item">
                        <i class="fas fa-award"></i>
                        <span>品牌保障</span>
                    </div>
                </div>
            </div>
            
            <div class="product-poster-footer">
                <div class="footer-shop-info">
                    <div class="shop-badge-small">源直达</div>
                    <span class="shop-name-small">农跃帮小店</span>
                </div>
                <div class="footer-qr">
                    <div class="qr-code-small">
                        <i class="fas fa-qrcode"></i>
                    </div>
                    <div class="qr-label">扫码购买</div>
                </div>
            </div>
        </div>
    `;
}

// 复制链接
function copyLink() {
    closeShareModal();
    const link = `https://mall.yunnonggu.com/${currentShareType}/${Date.now()}`;
    
    // 创建临时输入框复制链接
    const tempInput = document.createElement('input');
    tempInput.value = link;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    showNotification('链接已复制到剪贴板', 'success');
}

// 添加店铺海报页面到pageData
pageData.shopPoster = {
    title: '店铺分享海报',
    subtitle: '生成分享图片',
    content: `
        <div class="mobile-page poster-page">
            <div class="poster-header">
                <button class="back-btn" onclick="loadPage('shopDetail')">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <h1>分享海报</h1>
                <div class="header-actions"></div>
            </div>
            
            <div class="poster-content">
                <div class="poster-preview">
                    <div class="poster-card shop-poster">
                        <div class="poster-top-banner">
                            <div class="banner-badge">源直达</div>
                            <h2 class="poster-title">农跃帮小店</h2>
                            <div class="poster-subtitle">新鲜农产品·专业农资·智能农机</div>
                        </div>
                        
                        <div class="poster-products">
                            <div class="poster-product-row">
                                <div class="poster-product-item">
                                    <div class="poster-product-img">
                                        <i class="fas fa-helicopter"></i>
                                    </div>
                                    <div class="poster-product-name">无人机撒药</div>
                                    <div class="poster-product-price">¥20元/亩</div>
                                </div>
                                <div class="poster-product-item">
                                    <div class="poster-product-img">
                                        <i class="fas fa-helicopter"></i>
                                    </div>
                                    <div class="poster-product-name">无人机巡田</div>
                                    <div class="poster-product-price">¥23元/亩</div>
                                </div>
                            </div>
                            <div class="poster-product-row">
                                <div class="poster-product-item">
                                    <div class="poster-product-img">
                                        <i class="fas fa-tractor"></i>
                                    </div>
                                    <div class="poster-product-name">拖拉机耕地</div>
                                    <div class="poster-product-price">¥45元/亩</div>
                                </div>
                                <div class="poster-product-item">
                                    <div class="poster-product-img">
                                        <i class="fas fa-tractor"></i>
                                    </div>
                                    <div class="poster-product-name">联合收割机</div>
                                    <div class="poster-product-price">¥58元/亩</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="poster-bottom">
                            <div class="poster-qr">
                                <div class="qr-code">
                                    <i class="fas fa-qrcode"></i>
                                </div>
                                <div class="qr-text">长按识别二维码<br>进店选购</div>
                            </div>
                            <div class="poster-slogan">
                                <div class="slogan-big">引领农业未来</div>
                                <div class="slogan-small">让农业更美好</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="poster-actions">
                    <button class="poster-btn save-btn" onclick="savePoster()">
                        <i class="fas fa-download"></i> 保存图片
                    </button>
                    <button class="poster-btn share-btn" onclick="showShareModal('shop', '农跃帮小店')">
                        <i class="fas fa-share-alt"></i> 继续分享
                    </button>
                </div>
            </div>
        </div>
    `
};

// 添加商品海报页面到pageData
pageData.productPoster = {
    title: '商品分享海报',
    subtitle: '生成分享图片',
    content: `
        <div class="mobile-page poster-page">
            <div class="poster-header">
                <button class="back-btn" onclick="loadPage('productDetail')">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <h1>分享海报</h1>
                <div class="header-actions"></div>
            </div>
            
            <div class="poster-content">
                <div class="poster-preview">
                    <div class="poster-card product-poster">
                        <div class="product-poster-header">
                            <h2 class="poster-product-title">爆款直降</h2>
                            <div class="poster-product-subtitle">精选农资 低价抢鲜</div>
                        </div>
                        
                        <div class="product-poster-main">
                            <div class="main-product-display">
                                <div class="main-product-img">
                                    <img src="玉米病虫害01.png" alt="商品" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                                    <div class="placeholder-img" style="display:none;">
                                        <i class="fas fa-box"></i>
                                    </div>
                                </div>
                                <div class="main-product-info">
                                    <h3>史丹利高效氯氰菊酯</h3>
                                    <div class="product-features">
                                        <span class="feature-tag">高效杀虫</span>
                                        <span class="feature-tag">低毒环保</span>
                                        <span class="feature-tag">持效期长</span>
                                    </div>
                                    <div class="product-spec">规格：500ml</div>
                                    <div class="product-poster-price">
                                        <span class="price-label">限时特惠</span>
                                        <span class="price-value">¥25<span class="price-unit">元</span></span>
                                        <span class="original-price">¥88</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="product-highlights">
                                <div class="highlight-item">
                                    <i class="fas fa-shield-alt"></i>
                                    <span>正品保证</span>
                                </div>
                                <div class="highlight-item">
                                    <i class="fas fa-shipping-fast"></i>
                                    <span>限时包邮</span>
                                </div>
                                <div class="highlight-item">
                                    <i class="fas fa-award"></i>
                                    <span>品牌保障</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="product-poster-footer">
                            <div class="footer-shop-info">
                                <div class="shop-badge-small">源直达</div>
                                <span class="shop-name-small">农跃帮小店</span>
                            </div>
                            <div class="footer-qr">
                                <div class="qr-code-small">
                                    <i class="fas fa-qrcode"></i>
                                </div>
                                <div class="qr-label">扫码购买</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="poster-actions">
                    <button class="poster-btn save-btn" onclick="savePoster()">
                        <i class="fas fa-download"></i> 保存图片
                    </button>
                    <button class="poster-btn share-btn" onclick="showShareModal('product', '史丹利高效氯氰菊酯')">
                        <i class="fas fa-share-alt"></i> 继续分享
                    </button>
                </div>
            </div>
        </div>
    `
};

// 添加微信分享页面
pageData.wechatShare = {
    title: '微信分享',
    subtitle: '选择聊天',
    content: `
        <div class="mobile-page wechat-share-page">
            <div class="wechat-header">
                <button class="back-btn" onclick="closeShareModal(); loadPage('shopDetail')">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <h1>选择聊天</h1>
                <div class="header-actions">
                    <input type="text" class="wechat-search" placeholder="搜索">
                </div>
            </div>
            
            <div class="wechat-content">
                <div class="wechat-contact-list">
                    <div class="wechat-contact" onclick="selectWechatContact('张三')">
                        <div class="contact-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="contact-info">
                            <div class="contact-name">张三</div>
                            <div class="contact-msg">农业种植户</div>
                        </div>
                    </div>
                    
                    <div class="wechat-contact" onclick="selectWechatContact('李四')">
                        <div class="contact-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="contact-info">
                            <div class="contact-name">李四</div>
                            <div class="contact-msg">合作社负责人</div>
                        </div>
                    </div>
                    
                    <div class="wechat-contact" onclick="selectWechatContact('王五')">
                        <div class="contact-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="contact-info">
                            <div class="contact-name">王五</div>
                            <div class="contact-msg">农资经销商</div>
                        </div>
                    </div>
                    
                    <div class="wechat-contact" onclick="selectWechatContact('农业技术交流群')">
                        <div class="contact-avatar group">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="contact-info">
                            <div class="contact-name">农业技术交流群</div>
                            <div class="contact-msg">群聊(128人)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};

// 选择微信联系人
function selectWechatContact(contactName) {
    loadPage('wechatChat', contactName);
}

// 添加微信聊天页面
pageData.wechatChat = {
    title: '微信聊天',
    subtitle: '聊天界面',
    content: `
        <div class="mobile-page wechat-chat-page">
            <div class="wechat-chat-header">
                <button class="back-btn" onclick="loadPage('wechatShare')">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <h1 id="chatContactName">张三</h1>
                <div class="header-actions">
                    <button class="more-btn"><i class="fas fa-ellipsis-h"></i></button>
                </div>
            </div>
            
            <div class="wechat-chat-content">
                <div class="chat-messages">
                    <div class="chat-date">今天 14:30</div>
                    
                    <div class="message-item sent">
                        <div class="message-avatar me">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="message-bubble share-card" onclick="openSharedLink()">
                            <div class="share-card-image">
                                <i class="fas fa-store"></i>
                            </div>
                            <div class="share-card-content">
                                <div class="share-card-title">${currentShareTitle}</div>
                                <div class="share-card-desc">新鲜农产品，专业农资，智能农机</div>
                                <div class="share-card-footer">
                                    <i class="fas fa-link"></i>
                                    <span>云农谷商城</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="wechat-chat-input">
                <button class="input-tool-btn"><i class="fas fa-microphone"></i></button>
                <input type="text" class="chat-input" placeholder="发送消息">
                <button class="input-tool-btn"><i class="fas fa-smile"></i></button>
                <button class="input-tool-btn"><i class="fas fa-plus-circle"></i></button>
            </div>
        </div>
    `
};

// 打开分享的链接
function openSharedLink() {
    loadPage('h5Preview');
}

// 添加H5预览页面
pageData.h5Preview = {
    title: 'H5预览',
    subtitle: '分享链接预览',
    content: `
        <div class="mobile-page h5-preview-page">
            <div class="h5-header">
                <button class="back-btn" onclick="loadPage('wechatChat')">
                    <i class="fas fa-times"></i>
                </button>
                <h1>云农谷商城</h1>
                <div class="header-actions">
                    <button class="more-btn"><i class="fas fa-ellipsis-h"></i></button>
                </div>
            </div>
            
            <div class="h5-content">
                ${currentShareType === 'shop' ? `
                    <div class="h5-shop-preview">
                        <div class="h5-shop-banner">
                            <div class="h5-shop-logo">
                                <span class="badge-text">源直达</span>
                            </div>
                            <h2 class="h5-shop-name">农跃帮小店</h2>
                            <div class="h5-shop-intro">新鲜农产品，专业农资，智能农机，引领农业未来</div>
                            <button class="h5-follow-btn">
                                <i class="fas fa-plus"></i> 关注店铺
                            </button>
                        </div>
                        
                        <div class="h5-shop-products">
                            <h3 class="section-title">热门服务</h3>
                            <div class="h5-products-grid">
                                <div class="h5-product-card">
                                    <div class="h5-product-img">
                                        <i class="fas fa-helicopter"></i>
                                    </div>
                                    <div class="h5-product-name">无人机撒药</div>
                                    <div class="h5-product-price">¥20元/亩</div>
                                </div>
                                <div class="h5-product-card">
                                    <div class="h5-product-img">
                                        <i class="fas fa-helicopter"></i>
                                    </div>
                                    <div class="h5-product-name">无人机巡田</div>
                                    <div class="h5-product-price">¥23元/亩</div>
                                </div>
                                <div class="h5-product-card">
                                    <div class="h5-product-img">
                                        <i class="fas fa-tractor"></i>
                                    </div>
                                    <div class="h5-product-name">拖拉机耕地</div>
                                    <div class="h5-product-price">¥45元/亩</div>
                                </div>
                                <div class="h5-product-card">
                                    <div class="h5-product-img">
                                        <i class="fas fa-tractor"></i>
                                    </div>
                                    <div class="h5-product-name">联合收割机</div>
                                    <div class="h5-product-price">¥58元/亩</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="h5-login-prompt">
                            <button class="h5-login-btn" onclick="showH5Login()">
                                <i class="fas fa-user"></i> 登录查看更多
                            </button>
                        </div>
                    </div>
                ` : `
                    <div class="h5-product-preview">
                        <div class="h5-product-banner">
                            <img src="玉米病虫害01.png" alt="商品" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                            <div class="h5-banner-placeholder" style="display:none;">
                                <i class="fas fa-box"></i>
                            </div>
                        </div>
                        
                        <div class="h5-product-info">
                            <h2 class="h5-product-title">史丹利高效氯氰菊酯</h2>
                            <div class="h5-product-price-section">
                                <span class="h5-price-value">¥25</span>
                                <span class="h5-price-unit">元</span>
                                <span class="h5-original-price">¥88</span>
                            </div>
                            <div class="h5-product-tags">
                                <span class="h5-tag">高效杀虫</span>
                                <span class="h5-tag">低毒环保</span>
                                <span class="h5-tag">持效期长</span>
                            </div>
                            <div class="h5-product-desc">
                                <h4>产品特点</h4>
                                <p>规格：500ml | 产品毒性：低毒 | 产品剂型：水剂</p>
                                <p>防治对象：红蜘蛛等多种害虫</p>
                            </div>
                        </div>
                        
                        <div class="h5-login-prompt">
                            <button class="h5-login-btn" onclick="showH5Login()">
                                <i class="fas fa-shopping-cart"></i> 登录购买
                            </button>
                        </div>
                    </div>
                `}
            </div>
        </div>
    `
};

// 显示H5登录
function showH5Login() {
    showNotification('跳转到登录页面...', 'info');
    setTimeout(() => {
        showNotification('登录成功！', 'success');
    }, 1500);
}

// 保存海报
function savePoster() {
    showNotification('海报已保存到相册', 'success');
}

// 将函数暴露到全局
window.showShareModal = showShareModal;
window.closeShareModal = closeShareModal;
window.shareToWechat = shareToWechat;
window.shareToMoments = shareToMoments;
window.shareToDouyin = shareToDouyin;
window.shareToImage = shareToImage;
window.copyLink = copyLink;
window.selectWechatContact = selectWechatContact;
window.openSharedLink = openSharedLink;
window.showH5Login = showH5Login;
window.savePoster = savePoster;
window.showPosterModal = showPosterModal;
window.closePosterModal = closePosterModal;
window.savePosterFromModal = savePosterFromModal;