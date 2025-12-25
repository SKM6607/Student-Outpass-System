package webapp.main.srmhosteloutpass;

import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Arrays;

@WebServlet("/student_outpasses")
@MultipartConfig
public class DisplayOutpassServlet extends HttpServlet {
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        doGet(req, res);
    }
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws IOException {
        res.setContentType("application/json");
        req.setCharacterEncoding("UTF-8");
        req.getParameterMap().forEach((k, v) ->
                System.out.println(k + " = " + Arrays.toString(v))
        );
        String regNo = req.getParameter("registeredNumber");
        if (regNo == null || regNo.trim().isEmpty()) {
            System.out.println("Registered Number illaya?");
            res.getWriter().print("[]");
            return;
        }
        try (Connection conn = DBConnector.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT requestId,reason,applied_date,applied_time, leaving_date,leaving_time, expected_return_date,expected_return_time,type_of_outpass,proof_img, status FROM outpass_requests WHERE studentId = (SELECT id FROM students WHERE registeredNumber = ?)");
            ps.setString(1, regNo);
            ResultSet rs = ps.executeQuery();
            if(!rs.next()){
                System.out.println("No roww aaah");
                res.getWriter().print("[]");
                return;
            }
            StringBuilder json = new StringBuilder("[");
            boolean first = true;
            do{
                if (!first) json.append(",");
                first = false;
                json.append("""
            {
              "id": "%s",
              "reason": "%s",
              "applied_date": "%s",
              "applied_time": "%s",
              "from_date": "%s",
              "from_time": "%s",
              "to_date": "%s",
              "to_time": "%s",
              "type_of_outpass": "%s",
              "status": "%s"
            }
            """.formatted(
                        rs.getString("requestId"),
                        rs.getString("reason"),
                        rs.getString("applied_date"),
                        rs.getString("applied_time"),
                        rs.getString("leaving_date"),
                        rs.getString("leaving_time"),
                        rs.getString("expected_return_date"),
                        rs.getString("expected_return_time"),
                        rs.getString("type_of_outpass"),
                        rs.getString("status")
                ));
            }while (rs.next());
            json.append("]");
            res.getWriter().write(json.toString());
        } catch (Exception e) {
            System.out.println("SQL error aaaah");
            res.getWriter().print("[]");
        }
    }
}