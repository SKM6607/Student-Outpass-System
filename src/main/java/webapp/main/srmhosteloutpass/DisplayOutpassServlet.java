package webapp.main.srmhosteloutpass;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.IOException;
import java.sql.*;
@WebServlet("/student_outpasses")
public class DisplayOutpassServlet extends HttpServlet {
    protected void doPost(HttpServletRequest req,HttpServletResponse res) throws IOException {
        doGet(req,res);
    }
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws IOException {

        res.setContentType("application/json");

        String regNo = req.getParameter("registeredNumber");
        if (regNo == null || regNo.isEmpty()) {
            res.getWriter().print("[]");
            return;
        }

        try (Connection conn = DBConnector.getConnection()) {

            PreparedStatement ps = conn.prepareStatement("SELECT reason, from_date, to_date, status FROM outpass_requests WHERE studentId = (SELECT id FROM students WHERE registeredNumber = ?)");

            ps.setString(1, regNo);
            ResultSet rs = ps.executeQuery();

            StringBuilder json = new StringBuilder("[");
            boolean first = true;

            while (rs.next()) {
                if (!first) json.append(",");
                first = false;

                json.append("{")
                        .append("\"reason\":\"").append(rs.getString("reason")).append("\",")
                        .append("\"from_date\":\"").append(rs.getString("from_date")).append("\",")
                        .append("\"to_date\":\"").append(rs.getString("to_date")).append("\",")
                        .append("\"status\":\"").append(rs.getString("status")).append("\"")
                        .append("}");
            }

            json.append("]");
            res.getWriter().write(json.toString());

        } catch (Exception e) {
            res.getWriter().print("[]");
        }
    }
}
