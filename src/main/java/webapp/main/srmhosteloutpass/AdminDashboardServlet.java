package webapp.main.srmhosteloutpass;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.sql.*;

@WebServlet( "/admin_dashboard")
public class AdminDashboardServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        res.setContentType("application/json");
        JSONArray arr = new JSONArray();
        try (Connection conn = DBConnector.getConnection()) {

            PreparedStatement ps = conn.prepareStatement(
                    "SELECT name,studentId, rId, reason, from_date, to_date, status " +
                            "FROM outpass_requests WHERE status = 'Pending' ORDER BY rId DESC"
            );

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                JSONObject o = new JSONObject();
                o.put("name", rs.getString("name"));
                o.put("studentId", rs.getString("studentId"));
                o.put("rId", rs.getInt("rId"));
                o.put("reason", rs.getString("reason"));
                o.put("fromDate", rs.getString("from_date"));
                o.put("toDate", rs.getString("to_date"));
                o.put("status", rs.getString("status"));
                arr.put(o);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        res.getWriter().print(arr);
    }

}

