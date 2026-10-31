package ai.dmnu.dxd

import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.AttachFile
import androidx.compose.material.icons.filled.PushPin
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

private val Ink = Color(0xFF090A12)
private val Panel = Color(0xFF151827)
private val Cyan = Color(0xFF4DEBFF)
private val Purple = Color(0xFF9C7BFF)
private val White = Color(0xFFF2F4FF)
data class ChatLine(val text: String, val fromUser: Boolean)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { DmnuApp() }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DmnuApp() {
    val context = LocalContext.current
    val prefs = remember { context.getSharedPreferences("dmnu", 0) }
    var endpoint by remember { mutableStateOf(prefs.getString("endpoint", "") ?: "") }
    var showSettings by remember { mutableStateOf(false) }
    var draft by remember { mutableStateOf("") }
    var imageUri by remember { mutableStateOf<Uri?>(null) }
    var busy by remember { mutableStateOf(false) }
    var pinned by remember { mutableStateOf(false) }
    val messages = remember { mutableStateListOf(ChatLine("สวัสดี ฉันคือ Dmnu DxD AI ✦\nตั้งค่า URL ของ AI backend เพื่อเริ่มคุยกับ AI ของคุณ", false)) }
    val scope = rememberCoroutineScope()
    val picker = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { imageUri = it }

    MaterialTheme(colorScheme = darkColorScheme(primary = Cyan, secondary = Purple, background = Ink, surface = Panel, onPrimary = Ink, onBackground = White, onSurface = White)) {
        Scaffold(containerColor = Ink, topBar = {
            TopAppBar(title = { Column {
                Text("Dmnu DxD AI", fontWeight = FontWeight.Bold, color = White)
                Text("✦ AI ASSISTANT", color = Cyan, fontSize = 10.sp, letterSpacing = 2.sp)
            } }, actions = {
                IconButton(onClick = { pinned = !pinned }) { Icon(Icons.Default.PushPin, "ปักหมุดแชท", tint = if (pinned) Cyan else White) }
                IconButton(onClick = { showSettings = true }) { Icon(Icons.Default.Settings, "ตั้งค่า", tint = White) }
            }, colors = TopAppBarDefaults.topAppBarColors(containerColor = Ink))
        }, bottomBar = {
            Column(Modifier.fillMaxWidth().background(Panel).padding(10.dp)) {
                if (imageUri != null) Text("เลือกรูปแล้ว (ยังไม่ส่งรูปไปวิเคราะห์)", color = Cyan, fontSize = 12.sp)
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    IconButton(onClick = { picker.launch("image/*") }) { Icon(Icons.Default.AttachFile, "แนบรูป", tint = Cyan) }
                    Box(Modifier.weight(1f).background(Ink, RoundedCornerShape(18.dp)).padding(horizontal = 14.dp, vertical = 12.dp)) {
                        if (draft.isEmpty()) Text("ถามอะไร Dmnu DxD AI...", color = Color.Gray)
                        BasicTextField(value = draft, onValueChange = { draft = it }, textStyle = androidx.compose.ui.text.TextStyle(color = White, fontSize = 15.sp), modifier = Modifier.fillMaxWidth())
                    }
                    IconButton(enabled = !busy && draft.isNotBlank(), onClick = {
                        val prompt = draft.trim()
                        draft = ""
                        messages.add(ChatLine(prompt, true))
                        imageUri = null
                        busy = true
                        scope.launch {
                            messages.add(ChatLine(askBackend(endpoint, prompt), false))
                            busy = false
                        }
                    }) { Icon(Icons.Default.Send, "ส่งข้อความ", tint = if (busy) Color.Gray else Cyan) }
                }
            }
        }) { padding ->
            Column(Modifier.fillMaxSize().padding(padding).padding(horizontal = 14.dp)) {
                Row(Modifier.fillMaxWidth().padding(vertical = 10.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Text(if (pinned) "📌 แชทนี้ · ปักหมุดแล้ว" else "แชทใหม่", color = White, fontSize = 13.sp)
                    TextButton(onClick = { messages.clear(); messages.add(ChatLine("เริ่มแชทใหม่แล้ว ✦", false)); pinned = false }) {
                        Icon(Icons.Default.Add, null, tint = Cyan); Text("แชทใหม่", color = Cyan)
                    }
                }
                LazyColumn(Modifier.fillMaxSize(), verticalArrangement = Arrangement.spacedBy(10.dp), contentPadding = PaddingValues(bottom = 12.dp)) {
                    items(messages) { msg ->
                        Row(Modifier.fillMaxWidth(), horizontalArrangement = if (msg.fromUser) Arrangement.End else Arrangement.Start) {
                            Column(Modifier.widthIn(max = 310.dp).background(if (msg.fromUser) Color(0xFF26304A) else Panel, RoundedCornerShape(16.dp)).padding(13.dp)) {
                                Text(if (msg.fromUser) "คุณ" else "Dmnu DxD AI", color = if (msg.fromUser) Cyan else Purple, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                Spacer(Modifier.height(5.dp)); Text(msg.text, color = White, fontSize = 14.sp)
                            }
                        }
                    }
                    if (busy) item { Text("Dmnu กำลังคิด...", color = Cyan, modifier = Modifier.padding(8.dp)) }
                }
            }
        }
        if (showSettings) AlertDialog(
            onDismissRequest = { showSettings = false }, containerColor = Panel,
            title = { Text("ตั้งค่า AI Backend", color = White) },
            text = { Column {
                Text("ใส่ URL ของ API ที่รับ POST JSON {message: ...} และตอบกลับ {reply: ...}", color = White, fontSize = 13.sp)
                Spacer(Modifier.height(10.dp))
                OutlinedTextField(value = endpoint, onValueChange = { endpoint = it }, label = { Text("Backend URL") }, singleLine = true)
            } },
            confirmButton = { TextButton(onClick = { prefs.edit().putString("endpoint", endpoint.trim()).apply(); showSettings = false }) { Text("บันทึก", color = Cyan) } },
            dismissButton = { TextButton(onClick = { showSettings = false }) { Text("ยกเลิก", color = White) } }
        )
    }
}

private suspend fun askBackend(endpoint: String, message: String): String = withContext(Dispatchers.IO) {
    if (endpoint.isBlank()) return@withContext "ยังไม่ได้ตั้งค่า AI Backend ⚙️\nกดไอคอนตั้งค่าแล้วใส่ URL API ของคุณก่อน"
    var conn: HttpURLConnection? = null
    try {
        conn = (URL(endpoint).openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"; connectTimeout = 15000; readTimeout = 30000; doOutput = true
            setRequestProperty("Content-Type", "application/json; charset=utf-8")
        }
        conn.outputStream.use { it.write(JSONObject().put("message", message).toString().toByteArray(Charsets.UTF_8)) }
        val stream = if (conn.responseCode in 200..299) conn.inputStream else conn.errorStream
        val json = JSONObject(stream.bufferedReader().use { it.readText() })
        json.optString("reply").ifBlank { json.optString("message").ifBlank { "ไม่พบฟิลด์ reply หรือ message ในคำตอบ API" } }
    } catch (e: Exception) {
        "เชื่อมต่อ Backend ไม่สำเร็จ: ${e.message ?: "ไม่ทราบสาเหตุ"}"
    } finally { conn?.disconnect() }
}
